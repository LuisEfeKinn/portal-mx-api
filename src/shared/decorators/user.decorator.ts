import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { UserAuthModel } from '../model/auth.model'

export const User = createParamDecorator<UserAuthModel>(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
