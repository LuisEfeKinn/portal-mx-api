import * as dayjs from 'dayjs'

export function generateOrderCode(): string {
  const date = dayjs().format('YYYYMMDD')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${date}-${random}`
}
