import { BadRequestException } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
/**
 * Valida los campos de ordenamiento contra una lista blanca.
 * Lanza BadRequestException si hay campos inválidos.
 */
export function validateSortFields(
  sortFields: { field: string }[],
  validFields: string[],
) {
  const requestedFields = sortFields.map(({ field }) => field)
  const invalidFields = requestedFields.filter(
    (field) => !validFields.includes(field),
  )
  if (invalidFields.length > 0) {
    throw new BadRequestException({
      message: `Campos de ordenamiento inválidos: ${invalidFields.join(', ')}`,
      validFields: validFields.map((field) => ({ field })),
    })
  }
}

/**
 * Aplica ordenamiento múltiple a un SelectQueryBuilder según el string sort.
 * Ejemplo de sort: "user.name:asc,people.email:desc"
 */
export function getSortOrder<T>(
  query: SelectQueryBuilder<T>,
  sort: string,
  validFields: string[],
  prefix?: string,
) {
  if (!sort) return query
  const sortFields = sort.split(',').map((part) => {
    const [field, order = 'asc'] = part.split(':')
    const sortOrder: 'ASC' | 'DESC' =
      order.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
    return { field, order: sortOrder }
  })
  // Validar campos
  validateSortFields(sortFields, validFields)
  sortFields.forEach(({ field, order }, idx) => {
    const column = field.includes('.')
      ? field
      : prefix
        ? `${prefix}.${field}`
        : field
    if (idx === 0) {
      query.orderBy(column, order)
    } else {
      query.addOrderBy(column, order)
    }
  })
  return query
}
