import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { DiagramsService } from './diagrams.service.js';
import { GenerateDiagramDto } from './dto/generate-diagram.dto.js';
import { ReviewDiagramDto } from './dto/review-diagram.dto.js';

@Controller('diagrams')
@UseGuards(JwtAuthGuard)
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post('generate')
  generate(@CurrentUser('id') userId: string, @Body() dto: GenerateDiagramDto) {
    return this.diagramsService.generate(userId, dto);
  }

  @Post('review')
  review(@CurrentUser('id') userId: string, @Body() dto: ReviewDiagramDto) {
    return this.diagramsService.review(userId, dto);
  }

  @Get()
  getUserDiagrams(@CurrentUser('id') userId: string) {
    return this.diagramsService.getUserDiagrams(userId);
  }

  @Get(':id')
  getDiagram(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.diagramsService.getDiagram(userId, id);
  }
}
