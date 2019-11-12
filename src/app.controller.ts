import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  CacheInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiImplicitFile,
  ApiImplicitBody,
  ApiOkResponse,
  ApiUseTags,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './modules/users/dto/login-user.dto';
import { STATIC, SSL } from './environments';
import { CreateUserDto } from './modules/users/dto/create-user.dto';
import { UsersService } from './modules/users/users.service';
import { uploadFile } from './shared/upload';

@ApiUseTags('basic')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  // @ApiOperation({
  //   title: 'Login with email, password',
  // })
  @Post('login')
  @ApiImplicitBody({ name: 'input', type: LoginUserDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
    description: 'one file.',
  })
  async uploadFile(@UploadedFile() file) {
    const path = await uploadFile(file);

    return path;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('uploads')
  @UseInterceptors(FileInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'files',
    required: true,
    description: 'List of files.',
  })
  uploadFiles(@UploadedFile() files) {
    // console.log(files);
    return ['path', 'path1'];
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get(`${STATIC!}/:fileId`)
  getUpload(@Param('fileId') fileId, @Res() res): any {
    return res.sendFile(fileId, {
      root: `${STATIC!}`,
    });
  }

  @ApiOperation({
    title: 'Verify ssl file',
    deprecated: true,
  })
  @Get(`${SSL!}/:fileId`)
  getSSLKey(@Param('fileId') fileId, @Res() res): any {
    return res.sendFile(fileId, {
      root: `${SSL!}`,
    });
  }
}
