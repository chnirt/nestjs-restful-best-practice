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
	Body
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiImplicitFile,
	ApiImplicitBody,
	ApiUseTags,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LoginUserDto } from './modules/users/dto/login-user.dto'
import { STATIC, SSL } from './environments'
import { uploadFile } from './shared/upload'
import { LoginResponseDto } from './modules/users/dto/login-response.dto'
import { ErrorResponseDto } from './modules/users/dto/error-response.dto'
import { UserEntity } from './modules/users/user.entity'

@ApiResponse({ status: 401, description: 'Unauthorized.', type: ErrorResponseDto })
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiUseTags('basic')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService
	) { }

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: LoginResponseDto
	})
	@UseGuards(AuthGuard('local'))
	@ApiOperation({
		title: 'Retrieve one Acess token 👻'
	})
	@Post('login')
	@ApiImplicitBody({ name: 'input', type: LoginUserDto })
	login(@Request() req): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@ApiResponse({
		status: 200,
		description: 'The found profile',
		type: UserEntity
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Retrieve one Profile 👻'
	})
	@Get('profile')
	getProfile(@Request() req) {
		return req.user
	}

	@ApiResponse({
		status: 201,
		description: 'The record has been successfully created.',
		type: String
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Create one File 👻'
	})
	@Post('upload')
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'file',
		required: true,
	})
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file): Promise<string> {
		const path = await uploadFile(file)

		return path
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Retrieve many Files',
		deprecated: true
	})
	@Post('uploads')
	@UseInterceptors(FileInterceptor('files'))
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'files',
		required: true,
		description: 'List of files.'
	})
	uploadFiles(@UploadedFile() files: any) {
		// console.log(files);
		return ['path', 'path1']
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Retrieve one File'
		// deprecated: true
	})
	@Get(`${STATIC!}/:fileId`)
	getUpload(@Param('fileId') fileId: string, @Res() res): any {
		return res.sendFile(fileId, {
			root: `${STATIC!}`
		})
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Verify one Ssl',
		deprecated: true
	})
	@Get(`${SSL!}/:fileId`)
	getSSLKey(@Param('fileId') fileId: string, @Res() res): any {
		return res.sendFile(fileId, {
			root: `${SSL!}`
		})
	}
}
