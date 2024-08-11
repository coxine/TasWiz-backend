import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Put,
  Query,
  ALL,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

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

  @Get('/tasks')
  async getTasks(
    @Query('username') username: string,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader?.split(' ')[1];

    if (username === '123' && token === '12345678') {
      return {
        success: true,
        message: 'OK',
        data: [
          {
            projectID: 1,
            projectName: '待办',
            projectOwner: '123',
            tasks: [
              {
                taskID: 1,
                taskName: '任务1',
                taskOwner: '123',
                taskDetail: '# 123\n## 456',
                comments: [
                  {
                    content: '这是一条评论',
                    timestamp: 1145141919810,
                  },
                  {
                    content: '这是另一条评论',
                    timestamp: 1145148101919,
                  },
                ],
              },
              {
                taskID: 2,
                taskName: '任务2',
                taskOwner: '123',
                taskDetail: '# 123\n## 456',
                comments: [
                  {
                    content: '这是一条评论',
                    timestamp: 1145141919810,
                  },
                  {
                    content: '这是另一条评论',
                    timestamp: 1888888888888,
                  },
                ],
              },
            ],
          },
          {
            projectID: 2,
            projectName: '待办2',
            projectOwner: '123',
            tasks: [
              {
                taskID: 1,
                taskName: '任务1',
                taskOwner: '123',
                taskDetail: '# 123\n## 456',
                comments: [
                  {
                    content: '这是一条评论',
                    timestamp: 1145141919810,
                  },
                ],
              },
            ],
          },
        ],
      };
    } else if (token !== '12345678') {
      this.ctx.status = 401;
      return {
        success: false,
        message: 'Unauthorized',
      };
    } else {
      this.ctx.status = 404;
      return {
        success: false,
        message: 'User not found',
      };
    }
  }

  @Post('/comments', { middleware: [AuthMiddleware] })
  async addComment(
    @Body(ALL)
    body: {
      username: string;
      taskId: string;
      comment: string;
      timestamp: number;
    }
  ) {
    const { username, taskId, comment, timestamp } = body;

    if (username === '123') {
      // const result = await this.userService.addComment({ username, taskId, comment, timestamp });
      return {
        success: true,
        message: 'Comment added successfully',
        data: {
          username: username,
          taskId: taskId,
          comment: comment,
          timestamp: timestamp,
        },
      };
    } else {
      this.ctx.status = 401;
      return {
        success: false,
        message: 'Invalid token or unauthorized access',
      };
    }
  }

  @Put('/tasks', { middleware: [AuthMiddleware] })
  async editTask(
    @Body(ALL)
    body: {
      taskId: number;
      taskName: string;
      taskDetail: string;
      username: string;
      timestamp: number;
    }
  ) {
    const { taskId, taskName, taskDetail, username, timestamp } = body;

    if (username === '123') {
      // const result = await this.userService.editTask({
      //   taskId,
      //   taskName,
      //   taskDetail,
      //   timestamp,
      // });
      if (taskId === 1) {
        return {
          success: true,
          message: 'Task updated successfully',
          taskDetail: taskDetail,
          taskName: taskName,
          timestamp: timestamp,
        };
      } else {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Task not found',
        };
      }
    } else {
      this.ctx.status = 401;
      return {
        success: false,
        message: 'Invalid token or unauthorized access',
      };
    }
  }
}
