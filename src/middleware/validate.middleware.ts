import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class ValidateBodyMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const body: any = ctx.request.body;

      for (const key in body) {
        if (body[key] === undefined || body[key] === null || body[key] === '') {
          ctx.status = 400;
          ctx.body = {
            success: false,
            message: `Parameter ${key} is required and cannot be empty`,
          };
          return;
        }
      }

      await next();
    };
  }

  static getName(): string {
    return 'validateBody';
  }
}
