import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class GetOrganizeTvShowContentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Folder in media folder the base path is media folder',
  })
  folder: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Folder in media folder',
  })
  tvShowTitle: string;

  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    description:
      'If true, it only shows the information for the operation, the files will not be moved. Send false to execute the operation.',
    default: true,
  })
  @Transform(({ value }) => {
    return value === 'true';
  })
  dryRun = true;

  // @IsString({ each: true })
  // @IsNotEmpty()
  // @IsNotEmpty({ each: true })
  // @ApiPropertyOptional({
  //   type: String,
  //   isArray: true,
  //   example:
  //     'The.Good.Doctor.S01E01.AMZN.WEB-DL.1080p.Latino.www.shitpage.site.mkv',
  // })
  // paths: string[];
}
