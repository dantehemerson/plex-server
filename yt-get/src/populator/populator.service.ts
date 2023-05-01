import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE } from '../app.constants';
import { YoutubeService } from '../youtube/youtube.service';
import { DownloadYtVideoJob } from '../downloader/interfaces/download-yt-video-job.interface';
import { AiService } from '../ai/ai.service';

@Injectable()
export class PopulatorService {
  private readonly logger = new Logger(PopulatorService.name);

  constructor(
    @InjectQueue(QUEUE.YOUTUBE) private youtubeQueue: Queue<DownloadYtVideoJob>,
    private readonly youtubeService: YoutubeService,
    private readonly aiService: AiService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async populateYoutubeVideos() {
    try {
      console.log('\n\nPopulate youtube videos from playlist', {
        playlist: process.env.YOUTUBE__PLAYLIST_ID,
        beforeQueueCounts: await this.youtubeQueue.getJobCounts(),
      });

      if (!(await this.needsToPopulate())) {
        console.log(
          'There are waiting jobs in the queue, skipping population...',
        );
        return;
      }

      console.info('Populating youtube videos from playlist...');
      const videos = await this.youtubeService.getVideosFromPlaylist();

      if (videos.length === 0) {
        this.logger.log('No videos found in playlist.');
      }

      for (const video of videos) {
        const existsVideoInQueue = await this.youtubeQueue.getJob(
          video.contentDetails.videoId,
        );

        if (existsVideoInQueue) {
          console.info(
            `Video ${video.contentDetails.videoId} already exists in queue, skipping...`,
          );
          break;
        }

        console.info('Adding video to queue...', {
          videoId: video.contentDetails.videoId,
        });

        const videoTitle = await this.getBestVideoTitle(video.snippet.title);

        const job = await this.youtubeQueue.add(
          {
            videoYoutubeId: video.id,
            videoId: video.contentDetails.videoId,
            videoTitle,
          },
          {
            jobId: video.contentDetails.videoId,
          },
        );

        console.info('Video added to queue successfully!', {
          videoId: video.contentDetails.videoId,
          jobId: job.id,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log('\n\n');
    }
  }

  /**
   * If there is only one job in the queue, fetch more videos of the playlist to download
   */
  private async needsToPopulate() {
    const jobsInQueue = await this.youtubeQueue.getJobCounts();

    return jobsInQueue.waiting === 0;
  }

  private async getBestVideoTitle(originalTitle: string): Promise<string> {
    const response = await this.aiService.getMovieTitle({
      title: originalTitle,
    });

    return response?.title || originalTitle;
  }
}
