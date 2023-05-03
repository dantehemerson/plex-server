import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [OrganizerService],
  controllers: [OrganizerController],
})
export class OrganizerModule {}
