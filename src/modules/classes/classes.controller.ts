import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	UseGuards,
	Put,
	Body
} from '@nestjs/common'
import {
	ApiUseTags,
	ApiResponse,
	ApiBearerAuth,
	ApiOperation
} from '@nestjs/swagger'
import { ClassEntity } from './entity/class.entity'
import { ClassesService } from './classes.service'
import { AuthGuard } from '@nestjs/passport'
import { CreateClassDto } from './dto/create-class.dto'
import { ReplaceClassDto } from './dto/replace-class.dto'

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiUseTags('classes')
@Controller('classes')
export class ClassesController {
	constructor(private readonly classesService: ClassesService) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [ClassEntity]
	})
	@ApiOperation({
		title: 'Retrieve many Classs 👾'
	})
	@Get()
	findAll() {
		return this.classesService.findAll()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: ClassEntity
	})
	@ApiOperation({
		title: 'Create one Class 👾'
	})
	@Post()
	async insert(@Body() createClassDto: CreateClassDto) {
		const newClass = await this.classesService.insert(createClassDto)

		return newClass
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: ClassEntity
	})
	@ApiOperation({
		title: 'Retrieve one Class 👾'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.classesService.findOne(id)
	}

	@ApiOperation({
		title: 'Replace one Class 👾'
	})
	@Put(':id')
	replace(@Param('id') id: string, @Body() replaceClassDto: ReplaceClassDto) {
		return this.classesService.findOneAndReplace(id, replaceClassDto)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record is executed 👾',
		type: Boolean
	})
	@ApiOperation({
		title: 'Delete one Class 👾'
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.classesService.deleteOne(id)
	}
}
