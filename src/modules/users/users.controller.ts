import {
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
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
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
    title: 'Retrieve one User',
  })
  @Get(':_id')
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
