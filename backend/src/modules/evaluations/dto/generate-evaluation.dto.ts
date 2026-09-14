import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateEvaluationDto {
  @IsString()
  @IsNotEmpty()
  interviewId: string;
}
