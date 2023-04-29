import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetMovieTitleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  title: string;
}
