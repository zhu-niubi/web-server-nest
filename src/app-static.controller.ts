import { AuthService } from './modules/auth/auth.service';
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';

import { Public } from './decorators/public.decorator';
import { readFileSync } from 'fs';
import * as sharp from 'sharp';

import type { Response } from 'express';

@Controller('assets')
export class AppStaticController {
  constructor(private readonly authService: AuthService) {}
}
