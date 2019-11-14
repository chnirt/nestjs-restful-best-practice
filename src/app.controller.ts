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
	ApiOperation
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LoginUserDto } from './modules/users/dto/login-user.dto'
import { STATIC, SSL } from './environments'
import { uploadFile } from './shared/upload'
import { TotpDto } from './modules/users/dto/totp.dto'

@ApiUseTags('basic')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService
	) {}

	@Post('totp-generate')
	generateTotpToken() {
		return this.appService.generateTotpToken()
	}
	@Post('totp-validate/:token')
	verifyTotp(@Param('token') token: string) {
		return this.appService.verifyTotp(token)
	}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@UseGuards(AuthGuard('local'))
	@ApiOperation({
		title: 'Retrieve one Acess token'
	})
	@Post('login')
	@ApiImplicitBody({ name: 'input', type: LoginUserDto })
	login(@Request() req) {
		return this.authService.login(req.user)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	getProfile(@Request() req) {
		return req.user
	}

	// @ApiBearerAuth()
	// @UseGuards(AuthGuard('jwt'))
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'file',
		required: true,
		description: 'one file.'
	})
	async uploadFile(@UploadedFile() file) {
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
