import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Difficulty } from '@prisma/client';

export class GenerateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  topic: string;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
}
