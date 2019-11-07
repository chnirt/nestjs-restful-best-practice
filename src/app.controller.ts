import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Param,
  Res,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Login } from './modules/users/login.dto';
import { STATIC } from './environments';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(`${STATIC!}/:fileId`)
  getUpload(@Param('fileId') fileId, @Res() res): any {
    return res.sendFile(fileId, {
      root: `${STATIC!}`,
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() user: Login, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
