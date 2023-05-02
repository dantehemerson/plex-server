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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // if env, env file is passed in docker-compose
      envFilePath:
        process.env.NODE_ENV === 'production' ? undefined : ['../.env'],
    }),
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
    HealthModule,
  ],
  controllers: [AuthController, HealthController],
})
export class AppModule {}
