import { Injectable, StreamableFile } from '@nestjs/common'
import {
  CreateReapplicationDto,
  ReapplicationFiltersDto,
} from '../dtos/reapplication.dto'
import { ReapplicationService } from '../services/reapplication.service'

@Injectable()
export class ReapplicationUseCase {
  constructor(private readonly service: ReapplicationService) {}

  create(
    userId: number,
    dto: CreateReapplicationDto,
    file?: Express.Multer.File,
  ) {
    return this.service.create(userId, dto, file)
  }

  async findAll(filters: ReapplicationFiltersDto) {
    const page = Number(filters.page) || 1
    const perPage = Number(filters.perPage) || 10

    const [rows, totalItems] = await this.service.findAll({
      announcementId: filters.announcementId
        ? Number(filters.announcementId)
        : undefined,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
      search: filters.search,
      page,
      perPage,
    })

    const totalPages = Math.ceil(totalItems / perPage)
    return {
      rows: rows.map((r) => ({
        id: r.id,
        folio: `#${String(r.id).padStart(6, '0')}`,
        fecha: r.createdAt,
        proceso: r.announcement?.name ?? '',
        nombre: [r.user?.firstName, r.user?.firstLastname]
          .filter(Boolean)
          .join(' '),
        identificacion: r.user?.identification ?? '',
        incidencia: r.incidencia,
        description: r.description,
        documento: r.documentUrl ?? null,
      })),
      metadata: {
        totalItems,
        totalPages,
        itemsPerPage: perPage,
        currentPage: page,
        nextPage: totalPages - page <= 0 ? null : page + 1,
        searchTerm: filters.search ?? '',
      },
    }
  }

  findByUser(userId: number) {
    return this.service.findByUser(userId)
  }

  delete(id: number) {
    return this.service.delete(id)
  }

  async getCsv(filters: ReapplicationFiltersDto): Promise<StreamableFile> {
    const rows = await this.service.findAllForCsv({
      announcementId: filters.announcementId
        ? Number(filters.announcementId)
        : undefined,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
      search: filters.search,
    })

    const header =
      'Folio,Fecha,Proceso,Nombre,Identificacion,Incidencia,Descripcion,Documento'
    const lines = rows.map((r) => {
      const fullName = [r.user?.firstName, r.user?.firstLastname]
        .filter(Boolean)
        .join(' ')
      const doc = r.documentUrl ? r.documentUrl : 'N/A'
      return [
        `#${String(r.id).padStart(6, '0')}`,
        new Date(r.createdAt).toLocaleString('es-MX'),
        r.announcement?.name ?? '',
        fullName,
        r.user?.identification ?? '',
        `"${r.incidencia.replace(/"/g, '""')}"`,
        `"${r.description.replace(/"/g, '""')}"`,
        doc,
      ].join(',')
    })

    const csv = '\uFEFF' + [header, ...lines].join('\n')
    const buffer = Buffer.from(csv, 'utf-8')
    return new StreamableFile(buffer, {
      type: 'text/csv; charset=utf-8',
      disposition: 'attachment; filename="solicitudes.csv"',
    })
  }
}
