import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '../../utils'
import { Exclude, plainToClass } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'
import { Position } from '../../modules/deals/entity/position.entity'

@Entity({
	name: 'users',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class UserEntity {
	@ApiModelProperty({ description: 'The _id of the User' })
	@ObjectIdColumn()
	_id: string

	// basic

	@ApiModelProperty({ description: 'The name of the User' })
	@Column()
	name: string

	@ApiModelProperty({ description: 'The email of the User' })
	@Column()
	email: string

	@ApiModelProperty({ description: 'The password of the User' })
	@Exclude()
	@Column()
	password: string

	@ApiModelProperty({ description: 'The referralCode of the User' })
	@Column()
	referralCode: string

	@ApiModelProperty({ description: 'The search location of the User' })
	@Column()
	searchIn: Position

	// @Column()
	// countryCode: string; // Vietname +84
	// @Column()
	// phone: string; // 0704498756
	// @Column()
	// verified: boolean; // false
	// @Column()
	// authyId: string; // null

	@ApiModelProperty({ description: 'The avatar of the User' })
	@Column()
	avatar: string

	@ApiModelProperty({ description: 'The phone of the User' })
	@Column()
	phone: string

	@ApiModelProperty({ description: 'The verified of the User' })
	@Column()
	verified: boolean

	@ApiModelProperty({ description: 'The createdAt of the User' })
	@Column()
	createdAt: number
	@ApiModelProperty({ description: 'The updatedAt of the User' })
	@Column()
	updatedAt: number

	constructor(partial: Partial<UserEntity>) {
		if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.avatar =
				this.avatar ||
				'https://res.cloudinary.com/chnirt/image/upload/v1573662028/rest/2019-11-13T16:20:22.699Z.png'
			this.verified = this.verified || false
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
