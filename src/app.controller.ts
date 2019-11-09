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
  Body,
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
import * as cloudinary from 'cloudinary';
import { createReadStream } from 'fs';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './modules/users/dto/login-user.dto';
import { STATIC, CLOUD_NAME, API_KEY, API_SECRET } from './environments';
import { CreateUserDto } from './modules/users/dto/create-user.dto';
import { UsersService } from './modules/users/users.service';

@ApiUseTags('basic')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({
    title: 'Create one User',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
    description: 'one file.',
  })
  async uploadFile(@UploadedFile() file) {
    // console.log(file);

    cloudinary.config({
      cloud_name: CLOUD_NAME!,
      api_key: API_KEY!,
      api_secret: API_SECRET!,
    });

    const uniqueFilename = new Date().toISOString();

    const result = await new Promise(async (resolve, reject) =>
      createReadStream(file)
        .pipe(
          cloudinary.v2.uploader.upload_stream(
            {
              folder: 'restful',
              public_id: uniqueFilename,
              tags: `restful`,
            }, // directory and tags are optional
            (err, image) => {
              if (err) {
                reject(err);
              }
              resolve(image);
            },
          ),
        )
        .on('close', () => {
          resolve(true);
        })
        .on('error', () => reject(false)),
    );
    return result['secure_url'];
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
    console.log(files);
    return ['path', 'path1'];
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(`${STATIC!}/:fileId`)
  getUpload(@Param('fileId') fileId, @Res() res): any {
    return res.sendFile(fileId, {
      root: `${STATIC!}`,
    });
  }
}
