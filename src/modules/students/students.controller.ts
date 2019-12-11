import { Controller, Get, Body, Param, Put, Delete, Post } from '@nestjs/common'
import { StudentsService } from './students.service'
import { ApiResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { StudentEntity } from './entity/student.entity'
import { CreateStudentDto } from './dto/create-student.dto'
import { ReplaceStudentDto } from './dto/replace-student.dto'

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiUseTags('students')
@Controller('students')
export class StudentsController {
	constructor(private readonly studentsService: StudentsService) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [StudentEntity]
	})
	@ApiOperation({
		title: 'Retrieve many Students 👾'
	})
	@Get()
	findAll() {
		return this.studentsService.findAll()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: StudentEntity
	})
	@ApiOperation({
		title: 'Create one Student 👾'
	})
	@Post()
	async insert(@Body() createStudentDto: CreateStudentDto) {
		const newStudent = await this.studentsService.insert(createStudentDto)

		return newStudent
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: StudentEntity
	})
	@ApiOperation({
		title: 'Retrieve one Student 👾'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.studentsService.findOne(id)
	}

	@ApiOperation({
		title: 'Replace one Student 👾'
	})
	@Put(':id')
	replace(
		@Param('id') id: string,
		@Body() replaceStudentDto: ReplaceStudentDto
	) {
		return this.studentsService.findOneAndReplace(id, replaceStudentDto)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record is executed 👾',
		type: Boolean
	})
	@ApiOperation({
		title: 'Delete one Student 👾'
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.studentsService.deleteOne(id)
	}
}
