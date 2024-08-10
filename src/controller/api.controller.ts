import {
  Body,
  Controller,
  Get,
  Headers,
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
  async login(@Body(ALL) body: { username: string; password: string }) {
    const { username, password } = body;

    if (username === '123' && password === '456') {
      return {
        success: true,
        message: 'Login successful',
        token: '12345678',
      };
    } else {
      this.ctx.status = 401;
      return {
        success: false,
        message: 'Invalid username or password',
      };
    }
  }

  @Post('/isTokenValid')
  async isTokenValid(@Headers(ALL) headers: any): Promise<void> {
    const token = headers['authorization']?.split(' ')[1];

    if (token === '12345678') {
      this.ctx.status = 200;
      this.ctx.body = { message: 'Token is valid' };
    } else {
      this.ctx.status = 401;
      this.ctx.body = { message: 'Token is invalid or missing' };
    }
  }

  @Post('/register')
  async register(@Body(ALL) body: { username: string; password: string }) {
    const { username, password } = body;
    if (username === '123') {
      this.ctx.status = 409;
      return {
        success: false,
        message: 'Username already exists',
      };
    }

    if (username && password) {
      return {
        success: true,
        message: 'Registration successful',
        token: '12345678',
      };
    } else {
      this.ctx.status = 400;
      return {
        success: false,
        message: 'Invalid input',
      };
    }
  }
  @Post('/changePassword')
  async changePassword(
    @Body(ALL)
    body: {
      username: string;
      oldPassword: string;
      newPassword: string;
    }
  ) {
    const { username, oldPassword, newPassword } = body;

    if (username === '123' && oldPassword === '456') {
      if (oldPassword !== newPassword) {
        return {
          success: true,
          message: 'Password changed successfully',
        };
      } else {
        this.ctx.status = 500;
        return {
          message: 'Internal server error',
        };
      }
    } else {
      this.ctx.status = 401;
      return {
        success: false,
        message: 'Old password is incorrect',
      };
    }
  }
}
