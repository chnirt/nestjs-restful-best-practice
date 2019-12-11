import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { ApiResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { AttendanceEntity } from './entity/attendance.entity'
import { ReplaceAttendanceDto } from './dto/replace-attendance.dto'
import { CreateAttendanceDto } from './dto/create-attendance.dto'

@ApiUseTags('attendance')
@Controller('attendance')
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}

	@ApiResponse({
		status: 200,
		description: 'The found records',
		type: [AttendanceEntity]
	})
	@ApiOperation({
		title: 'Retrieve many attendance 👾'
	})
	@Get()
	findAll() {
		return this.attendanceService.findAll()
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: AttendanceEntity
	})
	@ApiOperation({
		title: 'Create one Attendance 👾'
	})
	@Post()
	async insert(@Body() createAttendanceDto: CreateAttendanceDto) {
		const newAttendance = await this.attendanceService.insert(
			createAttendanceDto
		)

		return newAttendance
	}

	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: AttendanceEntity
	})
	@ApiOperation({
		title: 'Retrieve one Attendance 👾'
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.attendanceService.findOne(id)
	}

	@ApiOperation({
		title: 'Replace one Attendance 👾'
	})
	@Put(':id')
	replace(
		@Param('id') id: string,
		@Body() replaceAttendanceDto: ReplaceAttendanceDto
	) {
		return this.attendanceService.findOneAndReplace(id, replaceAttendanceDto)
	}

	@ApiResponse({
		status: 200,
		description: 'The found record is executed 👾',
		type: Boolean
	})
	@ApiOperation({
		title: 'Delete one Attendance 👾'
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.attendanceService.deleteOne(id)
	}
}
