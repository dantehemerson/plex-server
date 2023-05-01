/* eslint-disable @typescript-eslint/no-var-requires */
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as path from 'path';
import type youtubedl from 'youtube-dl-exec';
import { QUEUE } from '../app.constants';
import { YoutubeService } from '../youtube/youtube.service';
import { DownloaderService } from './downloader.service';
import { DownloadYtVideoJob } from './interfaces/download-yt-video-job.interface';
const youtubeDlRequire = require('youtube-dl-exec');

const youtubeDl: typeof youtubedl = youtubeDlRequire;

@Processor(QUEUE.YOUTUBE)
export class DownloaderConsumer {
  private readonly logger = new Logger(
    `${DownloaderConsumer.name} (DownloadVideoJob)`,
  );

  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly downloaderService: DownloaderService,
  ) {}

  @Process({ concurrency: 1 })
  async downloadVideo(job: Job<DownloadYtVideoJob>) {
    try {
      this.logger.log('📹 Downloading video', job.data);

      if (
        this.downloaderService.doesMovieExistInMediaFolder(job.data.videoTitle)
      ) {
        this.logger.warn(
          'Video already exists in media folder, skipping download...',
          {
            videoTitle: job.data.videoTitle,
          },
        );
        await this.youtubeService.deleteVideoFromPlaylist(
          job.data.videoYoutubeId,
        );

        return;
      }

      const { _filename } = await youtubeDl(job.data.videoId, {
        noCheckCertificates: true,
        printJson: true,
        noWarnings: true,
        format: 'bestvideo+bestaudio',
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
        output: path.join(
          process.env.STORAGE_FOLDER,
          `yt-downloads`,
          `${job.data.videoTitle}.%(ext)s`,
        ),
      });

      this.logger.log(
        'Youtube video downloaded successfully',
        job.data.videoId,
        { _filename },
      );

      await this.youtubeService.deleteVideoFromPlaylist(
        job.data.videoYoutubeId,
      );

      this.logger.log('Moving video to media folder', _filename);

      await this.downloaderService.moveMovieToMediaFolder(_filename);
    } catch (error) {
      this.logger.error('Error downloading video', error);
    }
  }
}
