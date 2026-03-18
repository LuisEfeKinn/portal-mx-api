import { Injectable } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { Metadata, Paginated, PaginateQueryRaw } from '../dtos/paginated.dto'

@Injectable()
export class PaginatedService {
  async paginateRows<T>(
    qb: SelectQueryBuilder<T>,
    query: PaginateQueryRaw,
  ): Promise<Paginated<T>> {
    const take = Number(query.perPage)
    const page = Number(query.page)
    const skip = take * page - take

    const [rows, count] = await qb.take(take).skip(skip).getManyAndCount()

    const itemsPerPage = Number(query.perPage)
    const totalPages = Math.ceil(count / itemsPerPage)
    const totalItems = count
    const currentPage = Number(query.page)
    const nextPage = totalPages - currentPage <= 0 ? null : currentPage + 1

    const metadata: Metadata = {
      itemsPerPage,
      totalPages,
      totalItems,
      currentPage,
      nextPage,
      searchTerm: query.search || '',
    }

    return { rows, metadata }
  }

  async paginateRowsRaw<T>(
    qb: SelectQueryBuilder<T>,
    query: PaginateQueryRaw,
  ): Promise<Paginated<T>> {
    const take = Number(query.perPage)
    const page = Number(query.page)
    const skip = take * page - take

    const count = await qb.getCount()

    const paginatedQuery = qb.clone()
    paginatedQuery.limit(take).offset(skip)

    const rows = await paginatedQuery.getRawMany()

    const itemsPerPage = take
    const totalPages = Math.ceil(count / itemsPerPage)
    const totalItems = count
    const currentPage = page
    const nextPage = totalPages - currentPage <= 0 ? null : currentPage + 1

    const metadata: Metadata = {
      itemsPerPage,
      totalPages,
      totalItems,
      currentPage,
      nextPage,
      searchTerm: query.search || '',
    }

    return { rows, metadata }
  }

  async paginateRowsRawAgrupped<T>(
    qb: SelectQueryBuilder<T>,
    query: PaginateQueryRaw,
  ): Promise<Paginated<T>> {
    const take = Number(query.perPage)
    const page = Number(query.page)
    const skip = take * page - take

    // Crear una subconsulta para calcular el total de registros agrupados
    const totalCountQuery = qb.clone().select('COUNT(*)', 'total').getRawOne()
    const totalCountResult = await totalCountQuery

    const count = Number(totalCountResult?.total || 0)

    // Crear una subconsulta para aplicar paginación
    const paginatedQuery = qb
      .clone()
      .limit(take) // Usar limit en lugar de take para asegurar compatibilidad
      .offset(skip) // Usar offset para manejar el salto de registros

    // Obtener los registros paginados
    const rows = await paginatedQuery.getRawMany()

    const itemsPerPage = take
    const totalPages = Math.ceil(count / itemsPerPage)
    const totalItems = count
    const currentPage = page
    const nextPage = totalPages - currentPage <= 0 ? null : currentPage + 1

    const metadata: Metadata = {
      itemsPerPage,
      totalPages,
      totalItems,
      currentPage,
      nextPage,
      searchTerm: query.search || '',
    }

    return { rows, metadata }
  }
}
