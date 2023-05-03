import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AiService } from 'src/ai/ai.service';
import { FilesService } from '../files/files.service';
import { GetOrganizeTvShowContentDto } from './dto/get-organize-tv-show-content.dto';

@Injectable()
export class OrganizerService {
  private readonly logger = new Logger(OrganizerService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly filesService: FilesService,
  ) {}

  async organizeTvShowContent(params: GetOrganizeTvShowContentDto) {
    this.logger.log('Oranizing tvshow content', params);

    const mediaFolder = path.resolve(process.env.MEDIA_FOLDER);
    const baseFolder = path.join(mediaFolder, params.folder);

    const filePaths = this.filesService.getFilesInDirectory(baseFolder);

    this.logger.log('Generating destination path for', {
      filePaths,
      mediaFolder,
      baseFolder,
    });

    const episodeTitles = filePaths.filter(this.filesService.isVideoFile);

    const destinationPaths = await this.aiService.getEpisodeDestinationPaths(
      episodeTitles,
      params.tvShowTitle,
    );

    const filesToMove = destinationPaths
      .map((episode) => ({
        originalPath: episode.originalTitle,
        destinaePath: episode.path
          ? path.join(mediaFolder, 'tvshows', episode.path)
          : undefined,
      }))
      .filter((episode) => !!episode.destinaePath);

    if (!params.dryRun) {
      this.logger.warn('No dry run, moving files', filesToMove);
      filesToMove.forEach((episode) => {
        this.filesService.createFolderForFile(episode.destinaePath);
        fs.renameSync(episode.originalPath, episode.destinaePath);
      });
    }

    return filesToMove;
  }
}
