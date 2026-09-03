import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InterviewsService } from './interviews.service.js';
import { StartInterviewDto } from './dto/start-interview.dto.js';
import { InterviewMessageDto } from './dto/interview-message.dto.js';

@Controller('interviews')
@UseGuards(AuthGuard('jwt'))
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('start')
  start(@Request() req: any, @Body() dto: StartInterviewDto) {
    return this.interviewsService.start(req.user.sub, dto);
  }

  @Get('history')
  getHistory(@Request() req: any) {
    return this.interviewsService.getHistory(req.user.sub);
  }

  @Get(':id')
  getInterview(@Request() req: any, @Param('id') id: string) {
    return this.interviewsService.getInterview(req.user.sub, id);
  }

  @Post(':id/message')
  addMessage(@Request() req: any, @Param('id') id: string, @Body() dto: InterviewMessageDto) {
    return this.interviewsService.addMessage(req.user.sub, id, dto);
  }

  @Post(':id/finish')
  finishInterview(@Request() req: any, @Param('id') id: string) {
    return this.interviewsService.finishInterview(req.user.sub, id);
  }
}
