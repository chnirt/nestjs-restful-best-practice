import {
	Controller,
	Get,
	Query,
	Request,
	UseGuards,
	Post,
	Body,
	Param
} from '@nestjs/common'
import { ConnectionsService, Connection } from './connections.service'
import { ConnectionEntity } from './connection.entity'
import {
	ApiResponse,
	ApiOperation,
	ApiImplicitQuery,
	ApiBearerAuth,
	ApiUseTags
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { ErrorResponseDto } from '../../modules/users/dto/error-response.dto'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiResponse({
	status: 401,
	description: 'Unauthorized.',
	type: ErrorResponseDto
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiUseTags('connections')
@Controller('connections')
export class ConnectionsController {
	constructor(private readonly connectionsService: ConnectionsService) { }

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [ConnectionEntity]
	})
	@ApiOperation({
		title: 'Retrieve many Connections 👻'
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
	findAll(@Query() query, @Request() req): Promise<Connection[]> {
		return this.connectionsService.findAll(query, req)
	}

	@ApiResponse({
		status: 201,
		description: 'The record has been successfully created',
		type: ConnectionEntity
	})
	@ApiOperation({
		title: 'Create one Connection 👻'
	})
	@Post('/:dealId')
	insert(@Param('dealId') dealId: string, @Request() req): Promise<boolean> {
		return this.connectionsService.insert(dealId, req)
	}
}
