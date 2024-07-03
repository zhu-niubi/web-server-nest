import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { AuthService } from './modules/auth/auth.service';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
@UseInterceptors(TransformInterceptor)
export class AppApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @Public()
  @HttpCode(200)
  async login(@Request() req: LoginDto) {
    const tmp: LoginDto & { user?: any } = req;

    return this.authService.login(tmp.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get()
  getHello() {
    return 'HELLO ORCA!';
  }
}
