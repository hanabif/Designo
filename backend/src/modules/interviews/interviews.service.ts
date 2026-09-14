import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InterviewStage, InterviewStatus, MessageRole } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';
import { EvaluationsService } from '../evaluations/evaluations.service.js';
import { InterviewMessageDto } from './dto/interview-message.dto.js';
import { StartInterviewDto } from './dto/start-interview.dto.js';

const STAGE_SEQUENCE: InterviewStage[] = [
  InterviewStage.REQUIREMENTS_GATHERING,
  InterviewStage.NON_FUNCTIONAL_REQUIREMENTS,
  InterviewStage.CAPACITY_ESTIMATION,
  InterviewStage.HIGH_LEVEL_DESIGN,
  InterviewStage.DETAILED_DESIGN,
  InterviewStage.SCALABILITY,
  InterviewStage.RELIABILITY,
  InterviewStage.TRADEOFFS,
  InterviewStage.FINAL_ASSESSMENT,
];

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluations: EvaluationsService,
    private readonly ai: AiService,
  ) {}

  async start(userId: string, dto: StartInterviewDto) {
    const question = await this.prisma.question.findUnique({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.difficulty !== dto.difficulty) {
      throw new BadRequestException('Selected difficulty does not match the question');
    }

    const interview = await this.prisma.interview.create({
      data: {
        userId,
        questionId: dto.questionId,
        difficulty: dto.difficulty,
        companyTrack: dto.companyTrack,
        currentStage: InterviewStage.REQUIREMENTS_GATHERING,
        status: InterviewStatus.IN_PROGRESS,
      },
    });

    const initialGreeting = `Welcome to your ${dto.companyTrack} Track system design interview for "${question.title}". Let's start with Stage 1: Requirements Gathering. What functional use cases and features will our system support?`;

    await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.ASSISTANT,
        content: initialGreeting,
        stage: InterviewStage.REQUIREMENTS_GATHERING,
      },
    });

    return interview;
  }

  async getInterview(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        question: true,
        messages: { orderBy: { createdAt: 'asc' } },
        evaluation: true,
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async getHistory(userId: string) {
    return this.prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        question: { select: { title: true, difficulty: true } },
        evaluation: { select: { overallScore: true, status: true } },
      },
    });
  }

  async addMessage(userId: string, interviewId: string, dto: InterviewMessageDto) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        question: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    if (interview.status !== InterviewStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress interviews accept candidate messages');
    }

    // Persist candidate message
    const userMessage = await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.USER,
        content: dto.content,
        stage: interview.currentStage,
      },
    });

    // Advance stage after user turn
    const currentIndex = STAGE_SEQUENCE.indexOf(interview.currentStage);
    const nextStage =
      currentIndex >= 0 && currentIndex < STAGE_SEQUENCE.length - 1
        ? STAGE_SEQUENCE[currentIndex + 1]
        : InterviewStage.FINAL_ASSESSMENT;

    await this.prisma.interview.update({
      where: { id: interview.id },
      data: { currentStage: nextStage },
    });

    // Build conversation context for AI
    const history = interview.messages.map((m) => ({
      role: m.role === MessageRole.USER ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));
    history.push({ role: 'user', content: dto.content });

    const systemPrompt = [
      `You are an expert system design interviewer evaluating a candidate for question "${interview.question.title}" on the ${interview.companyTrack} Track.`,
      `The interview is advancing from ${interview.currentStage} to ${nextStage}.`,
      'Acknowledge the candidate response concisely, ask one targeted follow-up question for the next stage, and stay professional.',
    ].join(' ');

    const aiRes = await this.ai.executeDirect(
      AiUseCase.INTERVIEW_CHAT,
      history,
      { systemInstruction: systemPrompt, temperature: 0.7 },
    );

    const assistantMessage = await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.ASSISTANT,
        content: aiRes.content,
        stage: nextStage,
      },
    });

    return {
      userMessage,
      assistantMessage,
      currentStage: nextStage,
    };
  }

  async finishInterview(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.status === InterviewStatus.COMPLETED) return interview;
    if (interview.status !== InterviewStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress interviews can be finished');
    }

    const completed = await this.prisma.interview.update({
      where: { id: interview.id },
      data: { status: InterviewStatus.COMPLETED },
    });

    await this.evaluations.requestForCompletedInterview(userId, interviewId);
    return completed;
  }
}
