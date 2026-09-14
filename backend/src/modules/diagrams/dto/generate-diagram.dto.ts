import { DiagramFormat } from '@prisma/client';

export class GenerateDiagramDto {
  title: string;
  prompt: string;
  format?: DiagramFormat;
  interviewId?: string;
}
