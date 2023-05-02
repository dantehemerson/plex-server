import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  health() {
    return {
      ok: true,
      serverTime: new Date(),
      NODE_ENV: process.env.NODE_ENV,
      REDIS__HOST: process.env.REDIS__HOST,
      REDIS__PORT: process.env.REDIS__PORT,
      OPENAI__API_KEY: process.env.OPENAI_API_KEY,
      YOUTUBE__API_KEY: process.env.YOUTUBE_API_KEY,
    };
  }
}
