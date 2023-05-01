import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ChatGTPServiceProvider } from './providers/chatgpt/chatgpt.provider';

@Module({
  providers: [ChatGTPServiceProvider, AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
