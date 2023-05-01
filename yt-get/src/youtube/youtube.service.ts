import { HttpStatus, Injectable } from '@nestjs/common';
import { youtube_v3 } from '@googleapis/youtube';
import { InjectYoutubeApiService } from './providers/youtube-api/youtube-api.provider';

@Injectable()
export class YoutubeService {
  constructor(
    @InjectYoutubeApiService()
    private readonly youtubeApiService: youtube_v3.Youtube,
  ) {}

  async getVideosFromPlaylist(): Promise<youtube_v3.Schema$PlaylistItem[]> {
    const response = await this.youtubeApiService.playlistItems.list({
      part: ['contentDetails', 'snippet'],
      playlistId: process.env.YOUTUBE__PLAYLIST_ID,
      maxResults: 5,
    });

    return response.data.items;
  }

  async deleteVideoFromPlaylist(videoId: string): Promise<void> {
    try {
      const response = await this.youtubeApiService.playlistItems.delete({
        id: videoId,
      });

      if (response.status === HttpStatus.NO_CONTENT) {
        console.info('Video deleted successfully!');
      }
    } catch (error) {
      if (error.code === HttpStatus.NOT_FOUND) {
        console.info(
          'Video not found, probably already deleted from playlist.',
        );
        return;
      }
      throw error;
    }
  }
}
