import { SetMetadata } from '@nestjs/common'

export const ACCESS_CONTROL_KEY = 'access-control'

export const AccessControl = (itemId: number) =>
  SetMetadata(ACCESS_CONTROL_KEY, itemId)
