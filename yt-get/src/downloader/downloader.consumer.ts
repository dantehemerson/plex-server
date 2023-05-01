/* eslint-disable @typescript-eslint/no-var-requires */
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE } from '../app.constants';
import { DownloadYtVideoJob } from './interfaces/download-yt-video-job.interface';
import { YoutubeService } from '../youtube/youtube.service';
import type youtubedl from 'youtube-dl-exec';
const youtubeDlRequire = require('youtube-dl-exec');

const youtubeDl: typeof youtubedl = youtubeDlRequire;

@Processor(QUEUE.YOUTUBE)
export class DownloaderConsumer {
  private readonly logger = new Logger(DownloaderConsumer.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  @Process({ concurrency: 1 })
  async downloadVideo(job: Job<DownloadYtVideoJob>) {
    try {
      this.logger.log('DownloaderService.process()', job.data);

      await youtubeDl(job.data.videoId, {
        noCheckCertificates: true,
        noWarnings: true,
        // format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
        output: `./videos/${job.data.videoTitle}.%(ext)s`,
      });

      this.logger.log(
        'Youtube video downloaded successfully',
        job.data.videoId,
      );

      await this.youtubeService.deleteVideoFromPlaylist(
        job.data.videoYoutubeId,
      );
    } catch (error) {
      console.error('error', error);
    }
  }
}
