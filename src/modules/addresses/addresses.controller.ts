import {
	Controller,
	Post,
	Body,
	Request,
	UseGuards,
	Get,
	Query
} from '@nestjs/common'
import { ApiOperation, ApiBearerAuth, ApiImplicitQuery } from '@nestjs/swagger'
import { CreateAddressDto } from './dto/create-address.dto'
import { AddressesService } from './addresses.service'
import { AuthGuard } from '@nestjs/passport'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('addresses')
export class AddressesController {
	constructor(private readonly addressesService: AddressesService) {}

	@ApiOperation({
		title: 'Retrieve many Addresses'
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
		return this.addressesService.findAll(query)
	}

	@ApiOperation({
		title: 'Create one Address'
	})
	@Post()
	insert(@Body() createAddressDto: CreateAddressDto, @Request() req) {
		return this.addressesService.insert(createAddressDto, req)
	}
}
