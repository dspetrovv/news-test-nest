import { IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly text: string;
}
