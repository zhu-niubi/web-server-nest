import { HttpException } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

const EXCLUDE = ['assets', 'nalinv-logo.png', 'favicon.ico', 'api'];
const DEFAULT_LANG = 'en';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WebsiteService } from '../modules/website/website.service';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(private readonly websiteConfigService: WebsiteService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const langConfig = (await this.websiteConfigService.getLangConfig())?.data; // 获取语言配置
    if (!langConfig?.length)
      throw new HttpException('No default language', 500);
    const location =
      req.originalUrl.split('/').length > 1
        ? req.originalUrl.split('/')[1]
        : '';

    if (req.originalUrl === '/' || !req.originalUrl.split('/')[2])
      res.redirect('/' + DEFAULT_LANG + '/index.html');
    else if (
      ![...EXCLUDE, ...langConfig.map((l) => l.key)].includes(location)
    ) {
      res.redirect(req.path.replace(location, DEFAULT_LANG));
    } else {
      next();
    }
  }
}
