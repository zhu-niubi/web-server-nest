import { Public } from 'src/decorators/public.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  Logger,
  Get,
  Param,
  Res,
  StreamableFile,
  HttpException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CosService } from './cos.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, readFileSync } from 'fs';
import * as sharp from 'sharp';
import OOS from 'src/utils/alicos';

@Controller('api/cos')
export class CosController {
  private readonly logger = new Logger(CosController.name);
  constructor(private readonly cosService: CosService) {}

  @UseInterceptors(TransformInterceptor)
  @Post('/image')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'files', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: process.cwd() + '/public/assets/resources',
          filename: (req, file, cb) => {
            // console.log(
            //   file,
            //   Number(new Date()).toString() + extname(file.originalname || ''),
            // );
            cb(
              null,
              Number(new Date()).toString() + extname(file.originalname || ''),
            );
          },
        }),
      },
    ),
  )
  async Upload(
    @UploadedFiles()
    somefile: {
      file?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    let result: string | string[] = '';
    if (somefile.file)
      result =
        '/api/cos/resources/' +
        (somefile.file?.length > 0 ? somefile.file[0].filename : '');

    if (somefile.files)
      result = somefile.files.map((s) => '/api/cos/resources/' + s.filename);
    console.log('result', result);
    return result;
  }

  @UseInterceptors(TransformInterceptor)
  @Post('/image-oss')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'files', maxCount: 10 },
    ]),
  )
  async uploadToOSS(
    @UploadedFiles()
    somefile: {
      file?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    try {
      const result: string | string[] = [];
      console.log('somefile', somefile);
      if (somefile.file) {
        const file = somefile.file[0];

        console.log(file);
        const filePath = file.buffer;

        const objectKey =
          Number(new Date()).toString() + extname(file.originalname || '');

        // Upload the file to OSS
        const ossResult = await OOS().put('website/' + objectKey, filePath);
        console.log(ossResult);
        if (ossResult?.res.statusCode == 200) {
          const httpsUrl = ossResult.url;
          result.push(httpsUrl);
        }
      }

      if (somefile.files) {
        for (const file of somefile.files) {
          const filePath = file.buffer;
          const objectKey =
            Number(new Date()).toString() + extname(file.originalname || '');

          const ossResult = await OOS().put('website/' + objectKey, filePath);

          if (ossResult?.res.statusCode == 200) {
            const httpsUrl = ossResult.url;
            result.push(httpsUrl);
          }
        }
      }
      console.log('result', result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Public()
  @Get('resources/:filename')
  async getMedia(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const path = process.cwd() + '/public/assets/resources/' + filename;
    const fileExtname = extname(path);

    if (!existsSync(path)) throw new HttpException('NOT FOUND THIS FILE', 404);

    const file = readFileSync(
      process.cwd() + '/public/assets/resources/' + filename,
    );

    if (['.png', '.jpeg', '.jpg'].includes(fileExtname)) {
      const result = await sharp(file)
        .jpeg({ progressive: true, force: false, quality: 70 })
        .png({ progressive: true, force: false, quality: 70 })
        .toBuffer();
      // return new StreamableFile(image);
      res.set({
        'Content-Type': 'image/png',
      });

      return new StreamableFile(result);
    }

    if (['.svg'].includes(fileExtname)) {
      res.set({
        'Content-Type': 'image/svg+xml',
      });
    }
    return new StreamableFile(file);
  }
}
