import { IsNotEmpty } from 'class-validator';

export class CreateHobbyDto {

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;
}