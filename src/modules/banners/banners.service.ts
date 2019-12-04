import {
	Injectable,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { BannerEntity } from './banner.entity'
import { CreateBannerDto } from './dto/create-banner.dto'
import { ReplaceBannerDto } from './dto/replace-banner.dto'

export type Banner = any

@Injectable()
export class BannersService {
	async findAll(query): Promise<Banner[]> {
		const { offset, limit } = query

		if (offset < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		if (limit < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		return getMongoRepository(BannerEntity).find({
			where: {
				published: true
			},
			skip: +offset | 0,
			take: +limit | 100
		})
	}

	async insert(createBannerDto: CreateBannerDto): Promise<boolean> {
		const { position } = createBannerDto

		const foundBanner = await getMongoRepository(BannerEntity).findOne({
			position,
			published: true
		})

		if (foundBanner) {
			throw new ForbiddenException('Banner already published')
		}

		const newAddress = await getMongoRepository(BannerEntity).save(
			new BannerEntity({ ...createBannerDto })
		)

		return newAddress && true
	}

	async findOneAndReplace(
		_id: string,
		replaceBannerDto: ReplaceBannerDto
	): Promise<boolean> {
		const { position } = replaceBannerDto
		let foundBanner = await getMongoRepository(BannerEntity).findOne({
			position,
			published: true
		})

		if (foundBanner) {
			throw new ForbiddenException('Banner already published')
		}

		foundBanner = await getMongoRepository(BannerEntity).findOne({ _id })

		if (!foundBanner) {
			throw new NotFoundException('Banner not found')
		}

		const updateBanner = await getMongoRepository(BannerEntity).save(
			new BannerEntity({
				...foundBanner,
				...replaceBannerDto
			})
		)

		return updateBanner && true
	}
}
