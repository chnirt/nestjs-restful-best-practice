import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '../../utils'
// import { Exclude, plainToClass } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'

import { ConnectionType } from './enum/connection.enum'
import { CreatedByDto } from '../../modules/users/dto/created-by.dto'

@Entity({
	name: 'connections',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class ConnectionEntity {
	@ApiModelProperty({ description: 'The _id of the Connection' })
	@ObjectIdColumn()
	_id: string

	@ApiModelProperty({ description: 'The deal of the Connection' })
	@Column()
	deal: string

	@ApiModelProperty({ description: 'The amount of the Connection' })
	@Column()
	amount: number

	@ApiModelProperty({ description: 'The connectionType of the Connection' })
	@Column()
	connectionType: ConnectionType

	@ApiModelProperty({ description: 'The createdBy of the Connection' })
	@Column()
	connectedBy: CreatedByDto

	@ApiModelProperty({ description: 'The createdAt of the Connection' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the Connection' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<ConnectionEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.connectionType = ConnectionType.Connected
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
