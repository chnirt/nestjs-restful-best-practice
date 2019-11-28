import { Controller, Get, Query, Post, Body, Request, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiOperation, ApiImplicitQuery, ApiUseTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { ErrorResponseDto } from '../../modules/users/dto/error-response.dto';
import { BannerEntity } from './banner.entity';

@ApiResponse({ status: 401, description: 'Unauthorized.', type: ErrorResponseDto })
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiUseTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [BannerEntity]
  })
  @ApiOperation({
    title: 'Retrieve many Banners'
    // description: 'Aaa',
    // operationId: 'aaaa'
  })
  @Get()
  @ApiImplicitQuery({
    name: 'limit',
    description: 'The maximum number of transactions to return',
    required: false,
    type: Number
  })
  @ApiImplicitQuery({
    name: 'offset',
    description: 'The maximum number of transactions to skip',
    required: false,
    type: Number
  })
  findAll(@Query() query) {
    return this.bannersService.findAll(query)
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: BannerEntity
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    title: 'Create one Banner'
  })
  @Post()
  insert(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.insert(createBannerDto)
  }
}
