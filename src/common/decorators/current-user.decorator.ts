import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Since JwtStrategy now returns the full User entity,
    // request.user will carry the local database record.
    return request.user?.id;
  },
);
