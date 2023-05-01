import { Injectable, Logger } from '@nestjs/common';
import { ChatCompletionRequestMessage } from 'openai';
import { GetMovieTitleDto } from './dto/get-movie-title.dto';
import { extractMovieTitle } from './helpers/extract-movie-title.helper';
import { InjectChatGPTService } from './providers/chatgpt/chatgpt.provider';
import { ChatGPTService } from './providers/chatgpt/chatgpt.service';
import { MovieTitleDto } from './dto/movie-title.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectChatGPTService() private readonly chatGPTService: ChatGPTService,
  ) {}

  /**
   * Returns the title of a movie for a given file title(torrents, yt videos, etc.)
   */
  async getMovieTitle(params: GetMovieTitleDto): Promise<MovieTitleDto> {
    try {
      const messages: Array<ChatCompletionRequestMessage> = [
        {
          role: 'system',
          content: `Act as an assistant that will find the original title of a movie, which includes the movie name followed by the year it was released. 
          Use the following format: "<Movie title> (<year of release>)". 
          Use the information you have to create the complete title.
          Return the complete title in the same language it was provided in.
          
          Q: Escuela de vagabundos - película completa de Pedro Infante
          A: Escuela de vagabundos (1955)
          
          Respond using the provided format and do not add any additional information.`,
        },
        {
          role: 'user',
          content: params.title,
        },
      ];

      const response = await this.chatGPTService.completion({
        messages: messages,
      });

      const data = response.data;

      const messageContent = data?.choices?.[0]?.message?.content;

      const movieTitle = extractMovieTitle(messageContent);

      return {
        title: movieTitle,
        messageContent,
      };
    } catch (error) {
      this.logger.error('Error generating movie title with AI', error);

      return {
        title: undefined,
        messageContent: undefined,
        error: true,
      };
    }
  }
}
