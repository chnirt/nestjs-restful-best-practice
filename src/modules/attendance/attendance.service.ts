import {
	Injectable,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common'
import { AttendanceEntity } from './entity/attendance.entity'
import { CreateAttendanceDto } from './dto/create-attendance.dto'
import { getMongoRepository } from 'typeorm'
import { ReplaceAttendanceDto } from './dto/replace-attendance.dto'
import { StudentEntity } from '../../modules/students/entity/student.entity'

// let date = new Date()
// console.log('startOfDay', date.setHours(0, 0, 0, 0))
// console.log('endOfDay', date.setHours(23, 59, 59, 999))

export type Attendance = any

@Injectable()
export class AttendanceService {
	async findAll(): Promise<Attendance[] | undefined> {
		return getMongoRepository(AttendanceEntity).find()
	}

	async insert(
		createAttendanceDto: CreateAttendanceDto
	): Promise<Attendance | undefined> {
		const { studentId } = createAttendanceDto
		const foundStudent = await getMongoRepository(StudentEntity).findOne({
			_id: studentId
		})
		if (!foundStudent) {
			throw new NotFoundException('Student not found.')
		}
		const date = new Date()
		const existedAttendance = await getMongoRepository(
			AttendanceEntity
		).findOne({
			where: {
				studentId,
				createdAt: {
					$gt: date.setHours(0, 0, 0, 0),
					$lt: date.setHours(23, 59, 59, 999)
				}
			}
		})
		if (existedAttendance) {
			throw new ForbiddenException('Attendance already existed.')
		}
		const newAttendance = await getMongoRepository(AttendanceEntity).save(
			new AttendanceEntity({
				...createAttendanceDto
			})
		)
		return newAttendance
	}
	async findOne(_id: string): Promise<Attendance | undefined> {
		const foundAttendance = await getMongoRepository(AttendanceEntity).findOne({
			_id
		})
		if (!foundAttendance) {
			throw new NotFoundException('Attendance not found.')
		}
		return foundAttendance
	}
	async findOneAndReplace(
		_id: string,
		replaceAttendanceDto: ReplaceAttendanceDto
	): Promise<Attendance | undefined> {
		const foundAttendance = await getMongoRepository(AttendanceEntity).findOne({
			_id
		})
		if (!foundAttendance) {
			throw new NotFoundException('Attendance not found.')
		}
		const updateAttendance = await getMongoRepository(AttendanceEntity).save(
			new AttendanceEntity({
				...foundAttendance,
				...replaceAttendanceDto
			})
		)
		return updateAttendance
	}
	async deleteOne(_id: string): Promise<boolean | undefined> {
		const foundAttendance = await getMongoRepository(AttendanceEntity).findOne({
			_id
		})
		if (!foundAttendance) {
			throw new NotFoundException('Attendance not found.')
		}
		return (
			(await getMongoRepository(AttendanceEntity).delete(foundAttendance)) &&
			true
		)
	}
}
