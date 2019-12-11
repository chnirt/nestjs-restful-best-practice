import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { ApiModelProperty } from '@nestjs/swagger'
import { uuidv4 } from '../../../utils'

@Entity({
	name: 'attendance',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class AttendanceEntity {
	@ApiModelProperty({ description: 'The _id of the Attendance' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The studentId of the Attendance' })
	@Column()
	studentId: string

	@ApiModelProperty({ description: 'The present of the Attendance' })
	@Column()
	present: boolean

	@ApiModelProperty({ description: 'The createdAt of the Attendance' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Attendance' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<AttendanceEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
