export interface TokenPayloadModel {
  sub: number
  email: string
  organizationId?: number
}

export interface UserAuthModel {
  id: number
  email: string
}
