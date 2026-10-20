import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { AppAuthGuard } from '../../common/guards/app-auth.guard.js';
import { EvaluationsService } from './evaluations.service.js';
import { GenerateEvaluationDto } from './dto/generate-evaluation.dto.js';

@Controller('evaluations')
@UseGuards(AppAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluations: EvaluationsService) {}

  @Post('generate')
  generate(@Request() req: { user: { sub: string } }, @Body() dto: GenerateEvaluationDto) {
    return this.evaluations.request(req.user.sub, dto.interviewId);
  }

  @Get(':id')
  get(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.evaluations.get(req.user.sub, id);
  }
}
