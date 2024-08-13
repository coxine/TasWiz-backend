import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

const secretKey =
  '26117e60433ab66101c7fbc70afa9e9577c6c00d783cf2a183de4c536a2139f9'; // 请使用一个安全的密钥

@Middleware()
export class AuthMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.headers['authorization'];
      if (!token) {
        ctx.status = 401;
        ctx.body = { success: false, message: 'No token provided' };
        return;
      }

      try {
        const decoded = jwt.verify(token, secretKey);
        ctx.state.user = decoded;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { success: false, message: 'Failed to authenticate token' };
      }
    };
  }

  static getName(): string {
    return 'auth';
  }
}
