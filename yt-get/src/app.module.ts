import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DownloaderModule } from './downloader/downloader.module';
import { PopulatorModule } from './populator/populator.module';
import { YoutubeModule } from './youtube/youtube.module';
import { RedisMemoryServer } from 'redis-memory-server';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => {
        const redisServer = new RedisMemoryServer();

        return {
          redis: {
            host: await redisServer.getHost(),
            port: await redisServer.getPort(),
          },
        };
      },
    }),
    AiModule,
    YoutubeModule,
    AuthModule,
    DownloaderModule,
    PopulatorModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
