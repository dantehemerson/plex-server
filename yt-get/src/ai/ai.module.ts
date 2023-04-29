import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatGTPServiceProvider } from './providers/chatgpt/chatgpt.provider';
import { AiController } from './ai.controller';

@Module({
  providers: [ChatGTPServiceProvider, AiService],
  controllers: [AiController],
})
export class AiModule {}
