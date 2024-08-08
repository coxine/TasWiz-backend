import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  ALL,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
  @Post('/login')
  async login(
    @Body(ALL) body: { username: string; password: string },
    ctx: Context
  ) {
    const { username, password } = body;

    if (username === '123' && password === '456') {
      return {
        success: true,
        message: 'Login successful',
        token: 'jwt-token-string',
      };
    } else {
      ctx.status = 401;
      return {
        success: false,
        message: 'Invalid username or password',
      };
    }
  }
}
