import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '../../utils'
// import { Exclude, plainToClass } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'

import { Position } from '../deals/entity/position.entity'
import { AddressType } from './enum/address.enum'

@Entity({
	name: 'addresses',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class AddressEntity {
	@ApiModelProperty({ description: 'The _id of the Address' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The name of the Address' })
	@Column()
	name: string

	@ApiModelProperty({ description: 'The addressType of the Address' })
	@Column()
	addressType: AddressType

	@ApiModelProperty({ description: 'The location of the Address' })
	@Column()
	location: Position

	@ApiModelProperty({ description: 'The unitNumber of the Address' })
	@Column()
	unitNumber: number

	@ApiModelProperty({ description: 'The remarks of the Address' })
	@Column()
	remarks: string

	@ApiModelProperty({ description: 'The createdBy of the Address' })
	@Column()
	createdBy: string

	@ApiModelProperty({ description: 'The createdAt of the Address' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Address' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<AddressEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
