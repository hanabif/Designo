import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Difficulty, CompanyTrack } from '@prisma/client';

export class StartInterviewDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsEnum(CompanyTrack)
  companyTrack: CompanyTrack;
}
