import { Injectable } from '@nestjs/common';
import { InjectChatGPTService } from './providers/chatgpt/chatgpt.provider';
import { ChatGPTService } from './providers/chatgpt/chatgpt.service';
import { GetMovieTitleDto } from './dto/get-movie-title.dto';
import { ChatCompletionRequestMessage } from 'openai';

@Injectable()
export class AiService {
  constructor(
    @InjectChatGPTService() private readonly chatGPTService: ChatGPTService,
  ) {}

  /**
   * Returns the title of a movie for a given file title(torrents, yt videos, etc.)
   */
  async movieTitle(params: GetMovieTitleDto) {
    const messages: Array<ChatCompletionRequestMessage> = [
      {
        role: 'system',
        content: `Act as an assistant that will find the original title of a movie, which includes the movie name followed by the year it was released. 
        Use the following format: "<Movie title> (<year of release>)". 
        Use the information you have to create the complete title.
        Return the complete title in the same language it was provided in.
        
        Q: Escuela de vagabundos - película completa de Pedro Infante
        A: Escuela de vagabundos (1955)`,
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

    return data;
  }
}
