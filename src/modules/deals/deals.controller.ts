import {
	Controller,
	Get,
	Post,
	Body,
	Request,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	Param,
	Query
} from '@nestjs/common'
import { DealsService } from './deals.service'
import {
	ApiOperation,
	ApiResponse,
	ApiUseTags,
	ApiImplicitQuery,
	ApiConsumes,
	ApiImplicitFile,
	ApiBearerAuth
} from '@nestjs/swagger'

import { CreateDealDto } from './dto/create-deal.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { ItemType, ServiceType, DealType } from './enum/deal.enum'
import { ErrorResponseDto } from '../../modules/users/dto/error-response.dto'
import { DealEntity } from './deal.entity'

@ApiResponse({
	status: 401,
	description: 'Unauthorized.',
	type: ErrorResponseDto
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiUseTags('deals')
@Controller('deals')
export class DealsController {
	constructor(private readonly dealsService: DealsService) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [DealEntity]
	})
	@ApiOperation({
		title: 'Retrieve many Deals 👻'
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
	@ApiImplicitQuery({
		name: 'itemType',
		description: 'The itemType of the Deal',
		required: false,
		type: ItemType,
		enum: ['None', 'Meal', 'Drinks', 'Desserts', 'Snacks']
	})
	@ApiImplicitQuery({
		name: 'serviceType',
		description: 'The serviceType of the Deal',
		required: false,
		type: ServiceType,
		enum: [
			'FoodDelivery',
			'Pickup',
			'PharmacyPurchase',
			'Queue',
			'OverseasPurchase',
			'Others'
		]
	})
	@ApiImplicitQuery({
		name: 'dealType',
		description: 'The dealType of the Deal',
		required: false,
		type: DealType,
		enum: ['Request', 'Offer']
	})
	findAll(@Query() query) {
		return this.dealsService.findAll(query)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: DealEntity
	})
	@ApiOperation({
		title: 'Retrieve one Deal 👻'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.dealsService.findOne(id)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@ApiResponse({
		status: 201,
		description: 'The record has been successfully created.',
		type: DealEntity
	})
	@ApiOperation({
		title: 'Create one Deal 👻'
	})
	@Post()
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({
		name: 'thumbnail',
		// required: true,
		description: 'Send one file'
	})
	@UseInterceptors(FileInterceptor('thumbnail'))
	insert(
		@Body() createDealDto: CreateDealDto,
		@UploadedFile() file,
		@Request() req
	) {
		return this.dealsService.insert(createDealDto, file, req)
	}
}
