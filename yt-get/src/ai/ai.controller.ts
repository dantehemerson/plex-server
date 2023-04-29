import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { GetMovieTitleDto } from './dto/get-movie-title.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('movie-title')
  async movieTitle(@Query() params: GetMovieTitleDto) {
    return this.aiService.movieTitle(params);
  }
}
