import {
	Controller,
	UseGuards,
	Post,
	Get,
	Param,
	ClassSerializerInterceptor,
	UseInterceptors,
	Put,
	Patch,
	Body,
	Delete,
	UploadedFile,
	Request
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBearerAuth,
	ApiUseTags,
	ApiOperation,
	ApiResponse,
	ApiConsumes,
	ApiImplicitFile
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import * as jwt from 'jsonwebtoken'

import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReplaceUserDto } from './dto/replace-user.dto'
import { ErrorResponseDto } from './dto/error-response.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { OtpResponseDto } from './dto/otp-response.dto'
import { AuthService } from '../../auth/auth.service'

@ApiResponse({
	status: 401,
	description: 'Unauthorized.',
	type: ErrorResponseDto
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@UseInterceptors(ClassSerializerInterceptor)
@ApiUseTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService
	) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [UserEntity]
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Retrieve many Users 👻'
	})
	@Get()
	findAll() {
		return this.userService.findAll()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: LoginResponseDto
	})
	@ApiOperation({
		title: 'Create one User 👻'
	})
	@Post()
	async insert(@Body() createUserDto: CreateUserDto) {
		const newUser = await this.userService.insert(createUserDto)

		const loginResponseDto = await this.authService.login(newUser)

		return loginResponseDto
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: UserEntity
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Retrieve one User 👻'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Update one User 👻'
	})
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.findOneAndUpdate(id, updateUserDto)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Replace one User 👻'
	})
	@Put(':id')
	replace(@Param('id') id: string, @Body() replaceUserDto: ReplaceUserDto) {
		return this.userService.findOneAndReplace(id, replaceUserDto)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record is executed 👻',
		type: Boolean
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Delete one User 👻'
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.deleteOne(id)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record is executed',
		type: Boolean
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({
		title: 'Update one Avatar for current User 👻'
	})
	@Post('avatar')
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'avatar',
		required: true,
		description: 'Send one file'
	})
	@UseInterceptors(FileInterceptor('avatar'))
	updateAvatar(@Request() req, @UploadedFile() file) {
		const { user } = req
		const { _id } = user

		return this.userService.updateAvatar(_id, file)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiResponse({
		status: 201,
		description: 'The found record is executed',
		type: OtpResponseDto
	})
	@ApiOperation({
		title: 'Otp one User 👻'
	})
	@Post('/otp/:phone')
	otp1(@Request() req, @Param('phone') phone: string) {
		const { user } = req
		const { _id } = user

		return this.userService.otp(_id, phone)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiResponse({
		status: 200,
		description: 'The found record is executed',
		type: LoginResponseDto
	})
	@ApiOperation({
		title: 'Verify one User 👻'
	})
	@Post('/verify/:otp')
	async verify(
		@Request() req,
		@Param('otp') otp: string
	): Promise<LoginResponseDto | undefined> {
		const { user } = req
		const { _id } = user

		const updateUser = await this.userService.verify(_id, otp)

		const loginResponseDto = await this.authService.login(updateUser)

		return loginResponseDto
	}
}
