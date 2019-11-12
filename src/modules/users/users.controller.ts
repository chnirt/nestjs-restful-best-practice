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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiImplicitBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUseTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { UserEntity } from './user.entity';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    title: 'Retrieve many User',
    // description: 'Aaa',
    // operationId: 'aaaa',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    title: 'Create one User',
  })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserEntity,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    title: 'Retrieve one User',
  })
  @Get(':_id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserEntity,
  })
  findOne(@Param('_id') _id: string) {
    return this.userService.findOne(_id);
  }

  @ApiOperation({
    title: 'Update one User',
  })
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.findOneAndUpdate(_id, updateUserDto);
  }

  @ApiOperation({
    title: 'Replace one User',
  })
  @Put(':_id')
  replace(@Param('_id') _id: string, @Body() replaceUserDto: ReplaceUserDto) {
    return this.userService.findOneAndReplace(_id, replaceUserDto);
  }

  @ApiOperation({
    title: 'Delete one User',
  })
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.userService.deleteOne(_id);
  }
}
