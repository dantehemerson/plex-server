import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { GoogleOAuthProvider } from './providers/google-oauth/google-oauth.provider';
import { YoutubeApiServiceProvider } from './providers/youtube-api/youtube-api.provider';

@Module({
  providers: [GoogleOAuthProvider, YoutubeApiServiceProvider, YoutubeService],
  controllers: [YoutubeController],
  exports: [YoutubeService],
})
export class YoutubeModule {}
