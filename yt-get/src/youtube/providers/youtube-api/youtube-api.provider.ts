import { youtube_v3 } from '@googleapis/youtube';
import { Inject, Provider } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_OAUTH } from '../google-oauth/google-oauth.constants';
import { YOUTUBE_API_SERVICE } from './youtube-api.constants';

export const InjectYoutubeApiService = () => Inject(YOUTUBE_API_SERVICE);

export const YoutubeApiServiceProvider: Provider = {
  provide: YOUTUBE_API_SERVICE,
  useFactory: async (googleOauth: OAuth2Client) => {
    const youtube = new youtube_v3.Youtube({
      auth: googleOauth,
    });

    return youtube;
  },
  inject: [GOOGLE_OAUTH],
};
