import { Context } from '@midwayjs/koa';

export const handle400 = (ctx: Context) => {
  ctx.status = 400;
  ctx.body = {
    success: false,
    message: '无效输入！',
  };
};

export const handle401 = (ctx: Context) => {
  ctx.status = 401;
  ctx.body = {
    success: false,
    message: '无效登录信息',
  };
};

export const handle404 = (ctx: Context, msg: string) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: msg,
  };
};

export const handle409 = (ctx: Context) => {
  ctx.status = 409;
  ctx.body = {
    success: false,
    message: '用户名已存在',
  };
};

export const handle500 = (ctx: Context, error: Error) => {
  ctx.status = 500;
  console.error(error);
  ctx.body = {
    success: false,
    message: '服务器内部错误',
  };
};
