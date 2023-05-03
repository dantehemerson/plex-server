import { Injectable, Logger } from '@nestjs/common';
import { ChatCompletionRequestMessage } from 'openai';
import { GetMovieTitleDto } from './dto/get-movie-title.dto';
import { extractMovieTitle } from './helpers/extract-movie-title.helper';
import { InjectChatGPTService } from './providers/chatgpt/chatgpt.provider';
import { ChatGPTService } from './providers/chatgpt/chatgpt.service';
import { MovieTitleDto } from './dto/movie-title.dto';
import { EpisodeBestFullPath } from 'src/organizer/dto/episode-best-full-path.dto';
import * as path from 'path';
import { chunkArray } from '../common/helpers/chunk-array.helper';

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

  /**
   * Returns the folder path were an episode should be stored to keep organized the plex library.
   */
  async getEpisodeDestinationPaths(
    episodeTitles: string[],
    tvShowTitle: string,
  ): Promise<EpisodeBestFullPath[]> {
    const chunked = chunkArray(episodeTitles, 5);

    this.logger.log('Chunked files', chunked);

    const responses = await Promise.all(
      chunked.map((titles) =>
        this.generateEpisodeDestinationPath(titles, tvShowTitle),
      ),
    );

    return responses.flat();
  }

  private async generateEpisodeDestinationPath(
    episodeTitles: string[],
    tvShowTitle: string,
  ): Promise<EpisodeBestFullPath[]> {
    const titlesWithoutExtension = episodeTitles.map(
      (title) =>
        `${tvShowTitle} - ${path.basename(title, path.extname(title))}`,
    );

    this.logger.log('Getting destination path for', titlesWithoutExtension);

    try {
      const messages: Array<ChatCompletionRequestMessage> = [
        {
          role: 'system',
          content: `Act as an assistant that will help me to find the best path for an episode of a tv show in my plex media library folder to keep it organized based on the filename of movie.
          Use the information you have to create the path.
          Return the complete title in the same language it was provided in.
          
          The format is the next: 
                      "<Show name> (<year of release>)/Season <Season number> /S<Season number>e<Episode number> - <Original Episode title>". 
          
          Examples:        
          Q: The.Good.Doctor.S01E01.AMZN.WEB-DL.1080p.Latino.www.shitpage.site
             Mr. Robot (2015)/Season 02/S02e03 - eps2.1_k3rnel-pan1c.ksd
             Mr Robot S01E03 720p HDTV x264-IMMERSE [eztv]
             Mr Robot - Mr.Robot 1x04
          A: The Good Doctor (2017)/Season 01/S01e01 - Burnt Food
             Mr. Robot (2015)/Season 02/S02e03 - eps2.1_k3rnel-pan1c.ksd
             Mr. Robot (2015)/Season 01/S01e03 - eps1.2_d3bug.mkv
             Mr Robot (2015)/Season 01/S01e04 - eps1.3_da3m0ns.mp4

          If the input is a list separated by newlines, return an output for every input.
          If the input already contains the format expected, make sure it contains the right data.
          Return the list is the same order as the input.
          Respond using the provided format and do not add any additional information.`,
        },
        {
          role: 'user',
          content: titlesWithoutExtension.join('\n'),
        },
      ];

      const response = await this.chatGPTService.completion({
        messages: messages,
      });

      const data = response.data;

      const messageContent = data?.choices?.[0]?.message?.content || '';

      const generatedPaths = messageContent
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      // TODO: Do a regex match verification

      return episodeTitles.map((originalTitle, index) => {
        return {
          originalTitle: originalTitle,
          path: generatedPaths?.[index]
            ? `${generatedPaths[index]}${path.extname(originalTitle)}`
            : undefined,
        };
      });
    } catch (error) {
      this.logger.error('Error generating path with AI', error);

      throw new Error(`Coudn't generate paths`);
    }
  }
}
