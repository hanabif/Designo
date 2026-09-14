import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { StartInterviewDto } from './dto/start-interview.dto.js';
import { InterviewMessageDto } from './dto/interview-message.dto.js';
import { InterviewStage, InterviewStatus, MessageRole } from '@prisma/client';
import { EvaluationsService } from '../evaluations/evaluations.service.js';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService, private readonly evaluations: EvaluationsService) {}

  async start(userId: string, dto: StartInterviewDto) {
    const question = await this.prisma.question.findUnique({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.difficulty !== dto.difficulty) throw new BadRequestException('Selected difficulty does not match the question');
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

    await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.ASSISTANT,
        content: 'Hello! Let us begin the system design interview. Could you please clarify the functional requirements?',
        stage: InterviewStage.REQUIREMENTS_GATHERING,
      },
    });

    return interview;
  }

  async getInterview(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    if (interview.status !== InterviewStatus.IN_PROGRESS) throw new BadRequestException('Only in-progress interviews accept messages');

    return interview;
  }

  async getHistory(userId: string) {
    return this.prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        question: { select: { title: true } },
      }
    });
  }

  async addMessage(userId: string, interviewId: string, dto: InterviewMessageDto) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    const userMessage = await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.USER,
        content: dto.content,
        stage: interview.currentStage,
      },
    });

    // STUB: AI logic placeholder
    const assistantMessage = await this.prisma.interviewMessage.create({
      data: {
        interviewId: interview.id,
        role: MessageRole.ASSISTANT,
        content: 'I see. That makes sense. What about the non-functional requirements? (STUB AI RESPONSE)',
        stage: interview.currentStage,
      },
    });

    return {
      userMessage,
      assistantMessage,
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
    if (interview.status !== InterviewStatus.IN_PROGRESS) throw new BadRequestException('Only in-progress interviews can be finished');
    const completed = await this.prisma.interview.update({
      where: { id: interview.id },
      data: { status: InterviewStatus.COMPLETED },
    });
    await this.evaluations.requestForCompletedInterview(userId, interviewId);
    return completed;
  }
}
