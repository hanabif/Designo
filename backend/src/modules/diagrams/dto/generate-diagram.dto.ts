import { DiagramFormat } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateDiagramDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsOptional()
  @IsEnum(DiagramFormat)
  format?: DiagramFormat;

  @IsOptional()
  @IsString()
  interviewId?: string;
}
