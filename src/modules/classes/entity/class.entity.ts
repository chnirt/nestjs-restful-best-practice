import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { uuidv4 } from '../../../utils'

@Entity({
	name: 'classes',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class ClassEntity {
	@ApiModelProperty({ description: 'The _id of the Class' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The name of the Class' })
	@Column()
	name: string

	@ApiModelProperty({ description: 'The school of the Class' })
	@Column()
	school: string

	@ApiModelProperty({ description: 'The createdAt of the Class' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Class' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<ClassEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
