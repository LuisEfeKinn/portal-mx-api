export interface BulkUploadRowRaw {
  correo?: string
  nombre?: string
  // biome-ignore lint/style/useNamingConvention: nombres de columnas del Excel definidos por el cliente
  segundo_nombre?: string
  apellido?: string
  // biome-ignore lint/style/useNamingConvention: nombres de columnas del Excel definidos por el cliente
  segundo_apellido?: string
  identificacion?: string
  contrasena?: string
}

export interface BulkUploadError {
  fila: number
  correo: string
  motivo: string
}

export interface BulkUploadResultDto {
  total: number
  insertados: number
  omitidos: number
  errores: BulkUploadError[]
}
