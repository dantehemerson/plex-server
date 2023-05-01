import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const rename = util.promisify(fs.rename);

@Injectable()
export class DownloaderService {
  private readonly logger = new Logger(DownloaderService.name);

  private readonly moviesFolder = path.join(process.env.MEDIA_FOLDER, 'movies');

  doesMovieExistInMediaFolder(movieTitle: string): boolean {
    const fileNameWithoutExtension = path.parse(movieTitle).name;

    const files = fs.readdirSync(this.moviesFolder);

    return files.some((file) => file.includes(fileNameWithoutExtension));
  }

  async moveMovieToMediaFolder(filePath: string) {
    this.createFolderIfNotExists(this.moviesFolder);

    const fileName = path.basename(filePath);
    const newPath = path.join(this.moviesFolder, fileName);

    await rename(filePath, newPath);

    this.logger.log('Movie moved to media folder', { filePath, newPath });
  }

  private createFolderIfNotExists(folderPath: string) {
    const absolutePath = path.resolve(folderPath);

    if (!fs.existsSync(absolutePath)) {
      this.logger.warn('Folder does not exist, creating', absolutePath);
      fs.mkdirSync(absolutePath, { recursive: true });
    }
  }
}
