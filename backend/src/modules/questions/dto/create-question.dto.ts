import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Difficulty } from '@prisma/client';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  expectedComponents: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
