import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReviewDiagramDto {
  @IsString()
  @IsNotEmpty()
  diagramId!: string;

  @IsOptional()
  @IsString()
  diagramCode?: string;
}
