import { Middleware, IMiddleware } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, any, any> {
  resolve() {
    return async (ctx: Context, next: () => Promise<any>) => {
      const token = ctx.headers['authorization']?.split(' ')[1];
      if (token === '12345678') {
        await next();
      } else {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: 'Invalid token or unauthorized access',
        };
      }
    };
  }
}
