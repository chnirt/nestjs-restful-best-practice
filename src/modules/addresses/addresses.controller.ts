import {
	Controller,
	Post,
	Body,
	Request,
	UseGuards,
	Get,
	Query
} from '@nestjs/common'
import {
	ApiOperation,
	ApiBearerAuth,
	ApiImplicitQuery,
	ApiUseTags,
	ApiResponse
} from '@nestjs/swagger'
import { CreateAddressDto } from './dto/create-address.dto'
import { AddressesService, Address } from './addresses.service'
import { AuthGuard } from '@nestjs/passport'
import { ErrorResponseDto } from '../users/dto/error-response.dto'
import { AddressEntity } from './address.entity'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiResponse({
	status: 401,
	description: 'Unauthorized.',
	type: ErrorResponseDto
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiUseTags('addresses')
@Controller('addresses')
export class AddressesController {
	constructor(private readonly addressesService: AddressesService) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [AddressEntity]
	})
	@ApiOperation({
		title: 'Retrieve many Addresses 👻'
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
	findAll(@Query() query, @Request() req): Promise<Address[]> {
		return this.addressesService.findAll(query, req)
	}

	@ApiResponse({
		status: 201,
		description: 'The record has been successfully created',
		type: Boolean
	})
	@ApiOperation({
		title: 'Create one Address 👻'
	})
	@Post()
	insert(
		@Body() createAddressDto: CreateAddressDto,
		@Request() req
	): Promise<boolean> {
		return this.addressesService.insert(createAddressDto, req)
	}
}
