import { Module } from '@nestjs/common';
import { PopulatorService } from './populator.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { YoutubeModule } from '../youtube/youtube.module';
import { QUEUE } from '../app.constants';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: QUEUE.YOUTUBE,
    }),
    YoutubeModule,
    AiModule,
  ],
  providers: [PopulatorService],
})
export class PopulatorModule {}
