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

import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReplaceUserDto } from './dto/replace-user.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
	insert(@Body() createUserDto: CreateUserDto, @Request() req) {
		return this.userService.insert(createUserDto, req)
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
}
