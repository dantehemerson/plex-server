import { Controller, Get, Query } from '@nestjs/common';
import { GetOrganizeTvShowContentDto } from './dto/get-organize-tv-show-content.dto';
import { OrganizerService } from './organizer.service';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly organizeService: OrganizerService) {}

  @Get('organize-tvshow-content')
  async organizeTvShowContent(@Query() params: GetOrganizeTvShowContentDto) {
    return this.organizeService.organizeTvShowContent(params);
  }
}
