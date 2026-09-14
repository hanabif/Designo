import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException('Question not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.question.delete({
        where: { id },
      });
      return { message: 'Question deleted successfully' };
    } catch {
      throw new NotFoundException('Question not found');
    }
  }
}
