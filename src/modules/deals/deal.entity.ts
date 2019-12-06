import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '../../utils'
// import { Exclude, plainToClass } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'

import { ItemType, ServiceType, PaymentType, DealType } from './enum/deal.enum'
import { Position } from './entity/position.entity'
import { UserEntity } from '../users/user.entity'
import { CreatedByDto } from '../users/dto/created-by.dto'

@Entity({
	name: 'deals',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class DealEntity {
	@ApiModelProperty({ description: 'The _id of the Deal' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The dealType of the Deal' })
	@Column()
	dealType: DealType

	@ApiModelProperty({ description: 'The serviceType of the Deal' })
	@Column()
	serviceType: ServiceType

	@ApiModelProperty({ description: 'The itemType of the Deal' })
	@Column()
	itemType: ItemType

	@ApiModelProperty({ description: 'The items of the Deal' })
	@Column()
	items: string

	@ApiModelProperty({ description: 'The description of the Deal' })
	@Column()
	description: string

	@ApiModelProperty({ description: 'The shopName of the Deal' })
	@Column()
	shopName: string

	@ApiModelProperty({ description: 'The thumbnail of the Deal' })
	@Column()
	thumbnail: string

	@ApiModelProperty({ description: 'The location of the Deal' })
	@Column()
	location: Position

	@ApiModelProperty({ description: 'The destination of the Deal' })
	@Column() // I have no preference auto get location device
	destination: Position

	@ApiModelProperty({ description: 'The expiredAt of the Deal' })
	@Column() // 30m 1h 1h30 2h
	expiredAt: number

	@ApiModelProperty({ description: 'The payment of the Deal' })
	@Column()
	payment: PaymentType

	@ApiModelProperty({ description: 'The createdBy of the Deal' })
	@Column()
	createdBy: CreatedByDto

	@ApiModelProperty({ description: 'The createdAt of the Deal' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Deal' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<DealEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
