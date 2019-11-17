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
import { VerifyUserDto } from './dto/verify-user.dto'
import { ACCESS_TOKEN_SECRET } from '../../environments'
import { OtpUserDto } from './dto/otp-user.dto'

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiResponse({
	status: 200,
	description: 'The found record',
	type: [UserEntity]
})
@ApiResponse({
	status: 201,
	description: 'The record has been successfully created.',
	type: UserEntity
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiUseTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@ApiOperation({
		title: 'Retrieve many Users'
	})
	@Get()
	findAll() {
		return this.userService.findAll()
	}

	@ApiOperation({
		title: 'Create one User'
	})
	@Post()
	async insert(@Body() createUserDto: CreateUserDto) {
		const newUser = await this.userService.insert(createUserDto)

		return newUser
	}

	@ApiOperation({
		title: 'Retrieve one User'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id)
	}

	@ApiOperation({
		title: 'Update one User'
	})
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.findOneAndUpdate(id, updateUserDto)
	}

	@ApiOperation({
		title: 'Replace one User'
	})
	@Put(':id')
	replace(@Param('id') id: string, @Body() replaceUserDto: ReplaceUserDto) {
		return this.userService.findOneAndReplace(id, replaceUserDto)
	}

	@ApiOperation({
		title: 'Delete one User'
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.deleteOne(id)
	}

	@ApiOperation({
		title: 'Update one Avatar for current User'
	})
	@Post('avatar')
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'avatar',
		required: true,
		description: 'Send one file'
	})
	@UseInterceptors(FileInterceptor('avatar'))
	updateAvatar(@UploadedFile() file, @Request() req) {
		const { user } = req
		const { _id } = user

		return this.userService.updateAvatar(_id, file)
	}

	@ApiOperation({
		title: 'Otp one User'
	})
	@Post('/otp')
	otp(@Body() otpUserDto: OtpUserDto) {
		return this.userService.otp(otpUserDto)
	}

	@ApiOperation({
		title: 'Verify one User'
	})
	@Post('/verify')
	async verify(@Body() verifyUserDto: VerifyUserDto) {
		const updateUser = await this.userService.verify(verifyUserDto)
		// console.log(updateUser)
		const { _id } = updateUser

		const expiresIn = '30d'
		const payload = { sub: _id, expiresIn }

		return {
			access_token: jwt.sign(payload, ACCESS_TOKEN_SECRET!, { expiresIn }),
			expiresIn
		}
	}
}
