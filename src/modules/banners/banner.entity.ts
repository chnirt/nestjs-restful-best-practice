import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '../../utils'
import { ApiModelProperty } from '@nestjs/swagger'
@Entity({
  name: 'banners',
  orderBy: {
    createdAt: 'ASC'
  }
})
export class BannerEntity {
  @ApiModelProperty({ description: 'The _id of the Banner' })
  @ObjectIdColumn()
  _id: string

  @ApiModelProperty({ description: 'The title of the Banner' })
  @Column()
  title: string

  @ApiModelProperty({ description: 'The imageUrl of the Banner' })
  @Column()
  imageUrl: string

  @ApiModelProperty({ description: 'The position of the Banner' })
  @Column()
  position: number

  @ApiModelProperty({ description: 'The detail of the Banner' })
  @Column()
  detail: string

  @ApiModelProperty({ description: 'The published of the Banner' })
  @Column()
  published: boolean

  @ApiModelProperty({ description: 'The createdAt of the Banner' })
  @Column()
  createdAt: number
  @ApiModelProperty({ description: 'The updatedAt of the Banner' })
  @Column()
  updatedAt: number

  constructor(partial: Partial<BannerEntity>) {
    if (partial) {
      Object.assign(this, partial)
      this._id = this._id || uuidv4()
      this.createdAt = this.createdAt || +new Date()
      this.updatedAt = +new Date()
    }
  }
}
