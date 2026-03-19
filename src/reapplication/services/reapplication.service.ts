import { Injectable, NotFoundException } from '@nestjs/common'
import { UploadFileService } from 'src/shared/services/uploadFile.service'
import { CreateReapplicationDto } from '../dtos/reapplication.dto'
import { ReapplicationRepository } from '../repositories/reapplication.repository'

export interface ReapplicationFilters {
  announcementId?: number
  fromDate?: Date
  toDate?: Date
  search?: string
  page?: number
  perPage?: number
}

@Injectable()
export class ReapplicationService {
  constructor(
    private readonly repo: ReapplicationRepository,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(
    userId: number,
    dto: CreateReapplicationDto,
    file?: Express.Multer.File,
  ) {
    let documentUrl: string | undefined

    if (file) {
      const s3Result = await this.uploadFileService.s3_upload(
        file.buffer,
        process.env.AWS_BUCKET_NAME,
        `reapplications/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
        file.mimetype,
      )
      // biome-ignore lint/style/useNamingConvention: AWS SDK usa PascalCase para Location
      documentUrl = (s3Result as { Location?: string }).Location ?? undefined
    }

    return this.repo.save(
      this.repo.create({
        userId,
        announcementId: dto.announcementId,
        incidencia: dto.incidencia,
        description: dto.description,
        documentUrl,
      }),
    )
  }

  findAll(filters: ReapplicationFilters) {
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 10

    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .leftJoinAndSelect('r.announcement', 'a')
      .where('r.deletedAt IS NULL')
      .orderBy('r.createdAt', 'DESC')
      .skip(perPage * page - perPage)
      .take(perPage)

    if (filters.announcementId) {
      qb.andWhere('r.announcementId = :aid', { aid: filters.announcementId })
    }
    if (filters.fromDate) {
      qb.andWhere('r.createdAt >= :from', { from: filters.fromDate })
    }
    if (filters.toDate) {
      const to = new Date(filters.toDate)
      to.setHours(23, 59, 59, 999)
      qb.andWhere('r.createdAt <= :to', { to })
    }
    if (filters.search) {
      qb.andWhere(
        '(u.firstName LIKE :s OR u.firstLastname LIKE :s OR u.identification LIKE :s OR r.incidencia LIKE :s)',
        { s: `%${filters.search}%` },
      )
    }

    return qb.getManyAndCount()
  }

  findAllForCsv(filters: Omit<ReapplicationFilters, 'page' | 'perPage'>) {
    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .leftJoinAndSelect('r.announcement', 'a')
      .where('r.deletedAt IS NULL')
      .orderBy('r.createdAt', 'DESC')

    if (filters.announcementId) {
      qb.andWhere('r.announcementId = :aid', { aid: filters.announcementId })
    }
    if (filters.fromDate) {
      qb.andWhere('r.createdAt >= :from', { from: filters.fromDate })
    }
    if (filters.toDate) {
      const to = new Date(filters.toDate)
      to.setHours(23, 59, 59, 999)
      qb.andWhere('r.createdAt <= :to', { to })
    }
    if (filters.search) {
      qb.andWhere(
        '(u.firstName LIKE :s OR u.firstLastname LIKE :s OR u.identification LIKE :s OR r.incidencia LIKE :s)',
        { s: `%${filters.search}%` },
      )
    }

    return qb.getMany()
  }

  findByUser(userId: number) {
    return this.repo.find({
      where: { userId },
      relations: ['announcement'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({
      where: { id },
      relations: ['user', 'announcement'],
    })
    if (!r) throw new NotFoundException('Solicitud no encontrada')
    return r
  }

  async delete(id: number) {
    await this.findOne(id)
    await this.repo.softDelete(id)
  }
}
