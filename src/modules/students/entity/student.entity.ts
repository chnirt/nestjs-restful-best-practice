import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { uuidv4 } from '../../../utils'

@Entity({
	name: 'students',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class StudentEntity {
	@ApiModelProperty({ description: 'The _id of the Student' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The classId of the Student' })
	@Column()
	classId: string

	@ApiModelProperty({ description: 'The stt of the Student' })
	@Column()
	stt: number

	@ApiModelProperty({ description: 'The fullname of the Student' })
	@Column()
	fullName: string

	@ApiModelProperty({ description: 'The createdAt of the Student' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Student' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<StudentEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
