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
import { DealResponseDto } from './dto/deal-response.dto'
import { Position } from './entity/position.entity'

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
		type: [DealResponseDto]
	})
	@ApiOperation({
		title: 'Retrieve many Deals 👻'
		// description: 'Aaa',
		// operationId: 'aaaa'
	})
	// @Get(':searchIn')
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
	findAll(
		// @Param('searchIn') searchIn: string,
		@Query() query
	) {
		// console.log('sdasd', searchIn)
		return this.dealsService.findAll(query)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: DealResponseDto
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
		type: DealResponseDto
	})
	@ApiOperation({
		title: 'Create one Deal 👻'
	})
	@Post()
	insert(@Body() createDealDto: CreateDealDto, @Request() req) {
		return this.dealsService.insert(createDealDto, req)
	}
}
