import * as bcrypt from 'bcrypt';

import {
  Body,
  Controller,
  Del,
  Get,
  Headers,
  Inject,
  Post,
  Put,
  Query,
  ALL,
} from '@midwayjs/core';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { generateToken } from '../utils/token.utils';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @Post('/login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 401;
        return {
          success: false,
          message: 'Invalid username or password',
        };
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        this.ctx.status = 401;
        return {
          success: false,
          message: 'Invalid username or password',
        };
      }

      const token = generateToken({ username });

      return {
        success: true,
        message: 'Login successful',
        token,
      };
    } catch (error) {
      this.ctx.status = 500;
      console.error(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  @Post('/register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username },
      });
      if (existingUser) {
        this.ctx.status = 409;
        return {
          success: false,
          message: 'Username already exists',
        };
      }

      // 哈希密码
      const passwordHash = await bcrypt.hash(password, 10);

      // 创建新用户
      const newUser = new User();
      newUser.username = username;
      newUser.password_hash = passwordHash;
      newUser.token = generateToken({ username });

      await this.userRepository.save(newUser);

      return {
        success: true,
        message: 'Registration successful',
        token: newUser.token,
      };
    } catch (error) {
      this.ctx.status = 500;
      console.error(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  @Post('/changePassword', { middleware: [AuthMiddleware] })
  async changePassword(
    @Body('username') username: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string
  ) {
    console.log(username, oldPassword, newPassword);

    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Username not found',
        };
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password_hash
      );

      if (!isOldPasswordValid) {
        this.ctx.status = 401;
        return {
          success: false,
          message: 'Old password is incorrect',
        };
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      user.password_hash = newPasswordHash;

      await this.userRepository.save(user);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.ctx.status = 500;
      console.error(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  @Get('/projects')
  async getProjects(
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
                taskID: 3,
                taskName: '任务3',
                taskOwner: '123',
                taskDetail:
                  '# 123\n## 456\n\n111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
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

  @Put('/task', { middleware: [AuthMiddleware] })
  async editTask(
    @Body(ALL)
    body: {
      taskId: number;
      taskName: string;
      taskDetail: string;
      username: string;
    }
  ) {
    const { taskId, taskName, taskDetail, username } = body;

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
  @Get('/task', { middleware: [AuthMiddleware] })
  async getTask(
    @Query('taskId') taskId: number,
    @Query('username') username: string
  ) {
    if (username === '123' && taskId === 1) {
      // Simulate fetching task from database
      const task = {
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
      };

      return {
        success: true,
        task: task,
      };
    } else {
      this.ctx.status = 404;
      return {
        success: false,
        message: 'Task not found',
      };
    }
  }
  @Del('/task', { middleware: [AuthMiddleware] })
  async deleteTask(
    @Body('taskId') taskId: number,
    @Body('username') username: string
  ) {
    if (username === '123' && taskId === 1) {
      // Simulate deleting task from database
      const taskDeleted = true; // Assume the task is deleted successfully

      if (taskDeleted) {
        return {
          success: true,
          message: 'Task deleted successfully',
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

  @Del('/project', { middleware: [AuthMiddleware] })
  async deleteProject(
    @Body('projectId') projectId: number,
    @Body('username') username: string
  ) {
    if (username === '123' && projectId === 1) {
      // Simulate deleting project from database
      const projectDeleted = true; // Assume the project is deleted successfully

      if (projectDeleted) {
        return {
          success: true,
          message: 'Project deleted successfully',
        };
      } else {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Project not found',
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

  @Post('/project', { middleware: [AuthMiddleware] })
  async addProject(
    @Body('username') username: string,
    @Body('projectName') projectName: string
  ) {
    if (username && projectName) {
      // Simulate adding project to database
      const projectAdded = true; // Assume the project is added successfully

      if (projectAdded) {
        this.ctx.status = 201;
        return {
          success: true,
          message: 'Project created successfully',
          project: {
            username: username,
            projectName: projectName,
          },
        };
      } else {
        this.ctx.status = 500;
        return {
          success: false,
          message: 'Internal server error',
        };
      }
    } else {
      this.ctx.status = 400;
      return {
        success: false,
        message: 'Invalid request data',
      };
    }
  }

  @Post('/task', { middleware: [AuthMiddleware] })
  async createTask(
    @Body('taskName') taskName: string,
    @Body('taskDetail') taskDetail: string,
    @Body('username') username: string,
    @Body('projectId') projectId: number
  ) {
    if (taskName && taskDetail && username === '123' && projectId === 1) {
      // Simulate adding task to database
      const taskId = Math.floor(Math.random() * 1000); // Generate a random task ID
      const taskCreated = true; // Assume the task is created successfully

      if (taskCreated) {
        this.ctx.status = 201;
        return {
          success: true,
          message: 'Task created successfully',
          task: {
            taskId: taskId,
            taskName: taskName,
            taskDetail: taskDetail,
            username: username,
          },
        };
      } else {
        this.ctx.status = 500;
        return {
          success: false,
          message: 'Internal server error',
        };
      }
    } else {
      this.ctx.status = 400;
      return {
        success: false,
        message: 'Invalid request data',
      };
    }
  }
}
