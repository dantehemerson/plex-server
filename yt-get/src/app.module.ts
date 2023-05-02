import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisMemoryServer } from 'redis-memory-server';
import { AiModule } from './ai/ai.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { DownloaderModule } from './downloader/downloader.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { PopulatorModule } from './populator/populator.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => {
        // if (process.env.REDIS__HOST && process.env.REDIS__PORT) {
        //   console.log('👩‍🚒 Using configured redis database');
        //   return {
        //     redis: {
        //       host: process.env.REDIS__HOST,
        //       port: parseInt(process.env.REDIS__PORT),
        //     },
        //   };
        // }

        console.warn('Redis not configured, using in-memory redis database');

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
    HealthModule,
  ],
  controllers: [AuthController, HealthController],
})
export class AppModule {}
