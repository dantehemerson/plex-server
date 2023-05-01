import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../app.constants';
import { YoutubeModule } from '../youtube/youtube.module';
import { DownloaderConsumer } from './downloader.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE.YOUTUBE,
    }),
    YoutubeModule,
  ],
  providers: [DownloaderConsumer],
})
export class DownloaderModule {}
