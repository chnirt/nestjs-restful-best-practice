import { Controller, Get, Query, Post, Body, Request, UseGuards, Put, Param } from '@nestjs/common';
import { BannersService, Banner } from './banners.service';
import { ApiOperation, ApiImplicitQuery, ApiUseTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { BannerEntity } from './banner.entity';
import { ReplaceBannerDto } from './dto/replace-banner.dto';
import { ErrorResponseDto } from '../users/dto/error-response.dto';

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
    title: 'Retrieve many Banners 👻'
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
  findAll(@Query() query): Promise<Banner> {
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
    title: 'Create one Banner 👻'
  })
  @Post()
  insert(@Body() createBannerDto: CreateBannerDto): Promise<boolean> {
    return this.bannersService.insert(createBannerDto)
  }

  @ApiResponse({
    status: 200,
    description: 'The found record is executed',
    type: Boolean
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    title: 'Replace one Banner 👻'
  })
  @Put(':id')
  replace(@Param('id') id: string, @Body() replaceBannerDto: ReplaceBannerDto): Promise<boolean> {
    return this.bannersService.findOneAndReplace(id, replaceBannerDto)
  }
}
