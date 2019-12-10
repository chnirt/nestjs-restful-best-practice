import {
	Injectable,
	NotFoundException,
	ForbiddenException
} from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { StudentEntity } from './entity/student.entity'
import { ReplaceStudentDto } from './dto/replace-student.dto'
import { CreateStudentDto } from './dto/create-student.dto'
import { ClassEntity } from '../../modules/classes/entity/class.entity'

export type Student = any

@Injectable()
export class StudentsService {
	async findAll(): Promise<Student[] | undefined> {
		return getMongoRepository(StudentEntity).find()
	}

	async insert(
		createStudentDto: CreateStudentDto
	): Promise<Student | undefined> {
		const { classId, stt, fullName } = createStudentDto
		const foundClass = await getMongoRepository(ClassEntity).findOne({
			_id: classId
		})
		if (!foundClass) {
			throw new NotFoundException('Class not found.')
		}
		const existedStudent = await getMongoRepository(StudentEntity).findOne({
			where: {
				$or: [
					{ classId, stt },
					{ classId, fullName }
				]
			}
		})
		if (existedStudent) {
			throw new ForbiddenException('Stt or fullName already existed.')
		}
		const newStudent = await getMongoRepository(StudentEntity).save(
			new StudentEntity({
				...createStudentDto
			})
		)
		return newStudent
	}
	async findOne(_id: string): Promise<Student | undefined> {
		const foundStudent = await getMongoRepository(StudentEntity).findOne({
			_id
		})
		if (!foundStudent) {
			throw new NotFoundException('Student not found.')
		}
		return foundStudent
	}
	async findOneAndReplace(
		_id: string,
		replaceStudentDto: ReplaceStudentDto
	): Promise<Student | undefined> {
		const { classId, stt, fullName } = replaceStudentDto
		const foundStudent = await getMongoRepository(StudentEntity).findOne({
			_id
		})
		if (!foundStudent) {
			throw new NotFoundException('Student not found.')
		}
		const foundClass = await getMongoRepository(ClassEntity).findOne({
			_id: classId
		})
		if (!foundClass) {
			throw new NotFoundException('Class not found.')
		}
		const existedStudent = await getMongoRepository(StudentEntity).findOne({
			where: {
				$or: [{ stt }, { fullName }]
			}
		})
		if (existedStudent) {
			throw new ForbiddenException('Stt or fullName already existed.')
		}
		const updateStudent = await getMongoRepository(StudentEntity).save(
			new StudentEntity({
				...foundStudent,
				...replaceStudentDto
			})
		)
		return updateStudent
	}
	async deleteOne(_id: string): Promise<boolean | undefined> {
		const foundStudent = await getMongoRepository(StudentEntity).findOne({
			_id
		})
		if (!foundStudent) {
			throw new NotFoundException('Student not found.')
		}
		return (
			(await getMongoRepository(StudentEntity).delete(foundStudent)) && true
		)
	}
}
