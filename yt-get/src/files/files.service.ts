import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  createFolderForFile(filePath: string) {
    const folderPath = path.dirname(filePath);
    this.createFolderIfNotExists(folderPath);
  }

  createFolderIfNotExists(folderPath: string) {
    const absolutePath = path.resolve(folderPath);

    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
  }

  getFilesInDirectory(dir: string): string[] {
    let files: string[] = [];

    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);

      if (fs.statSync(filePath).isDirectory()) {
        // Recurse into subdirectories
        files = files.concat(this.getFilesInDirectory(filePath));
      } else {
        // Add file to the list
        files.push(filePath);
      }
    });

    return files;
  }

  isVideoFile(file: string): boolean {
    const movieExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.webm'];
    const fileExt = path.extname(file).toLowerCase();
    return movieExtensions.includes(fileExt);
  }
}
