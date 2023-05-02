import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  health() {
    return {
      ok: true,
      serverTime: new Date(),
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      YOUTUBE__PLAYLIST_ID: process.env.YOUTUBE__PLAYLIST_ID,
      AUTH__PROVIDERS__GOOGLE__CLIENT_ID:
        process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_ID,
      AUTH__PROVIDERS__GOOGLE__CLIENT_SECRET:
        process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_SECRET,
      AUTH__PROVIDERS__GOOGLE__REFRESH_TOKEN:
        process.env.AUTH__PROVIDERS__GOOGLE__REFRESH_TOKEN,
      MEDIA_FOLDER: process.env.MEDIA_FOLDER,
      PORT: process.env.PORT,
    };
  }
}
