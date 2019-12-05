import {
	Injectable,
	NotFoundException,
	ForbiddenException
} from '@nestjs/common'
import { CreateClassDto } from './dto/create-class.dto'
import { ClassEntity } from './entity/class.entity'
import { getMongoRepository } from 'typeorm'
import { ReplaceClassDto } from './dto/replace-class.dto'

export type Class = any

@Injectable()
export class ClassesService {
	async findAll(): Promise<Class[] | undefined> {
		return getMongoRepository(ClassEntity).find()
	}

	async insert(createClassDto: CreateClassDto): Promise<Class | undefined> {
		const { name } = createClassDto
		const existedClass = await getMongoRepository(ClassEntity).findOne({
			name
		})
		if (existedClass) {
			throw new ForbiddenException('Name already existed.')
		}
		const newClass = await getMongoRepository(ClassEntity).save(
			new ClassEntity({
				...createClassDto
			})
		)
		return newClass
	}
	async findOne(_id: string): Promise<Class | undefined> {
		const foundClass = await getMongoRepository(ClassEntity).findOne({ _id })
		if (!foundClass) {
			throw new NotFoundException('Class not found.')
		}
		return foundClass
	}
	async findOneAndReplace(
		_id: string,
		replaceClassDto: ReplaceClassDto
	): Promise<Class | undefined> {
		const foundClass = await getMongoRepository(ClassEntity).findOne({ _id })
		if (!foundClass) {
			throw new NotFoundException('Class not found.')
		}
		const updateClass = await getMongoRepository(ClassEntity).save(
			new ClassEntity({
				...foundClass,
				...replaceClassDto
			})
		)
		return updateClass
	}
	async deleteOne(_id: string): Promise<boolean | undefined> {
		const foundClass = await getMongoRepository(ClassEntity).findOne({ _id })
		if (!foundClass) {
			throw new NotFoundException('Class not found.')
		}
		return (await getMongoRepository(ClassEntity).delete(foundClass)) && true
	}
}
