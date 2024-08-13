import * as bcrypt from 'bcrypt';

import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Post,
  Put,
  Query,
  ALL,
} from '@midwayjs/core';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Project } from '../entity/project.entity';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { generateToken } from '../utils/token.utils';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(Task)
  taskRepository: Repository<Task>;

  @InjectEntityModel(Project)
  projectRepository: Repository<Project>;

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

  @Get('/projects', { middleware: [AuthMiddleware] })
  async getProjects(@Query('username') username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        relations: [
          'projects',
          'projects.tasks',
          'projects.tasks.comments',
          'projects.tasks.task_owner',
        ],
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const projects = user.projects.map(project => ({
        projectID: project.project_id,
        projectName: project.project_name,
        projectOwner: user.username,
        tasks: project.tasks.map(task => ({
          taskID: task.task_id,
          taskName: task.task_name,
          taskOwner: task.task_owner.username,
          taskDetail: task.task_detail,
          comments: task.comments.map(comment => ({
            content: comment.content,
            timestamp: comment.timestamp,
          })),
        })),
      }));

      return projects;
    } catch (error) {
      this.ctx.status = 500;
      console.error(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  @Post('/project', { middleware: [AuthMiddleware] })
  async createProject(
    @Body('username') username: string,
    @Body('projectName') projectName: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const newProject = new Project();
      newProject.project_name = projectName;
      newProject.project_owner = user;

      await this.projectRepository.save(newProject);

      this.ctx.status = 201;
      return {
        success: true,
        message: 'Project created successfully',
        project: {
          username: user.username,
          projectName: newProject.project_name,
        },
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

  @Del('/project', { middleware: [AuthMiddleware] })
  async deleteProject(
    @Body('projectId') projectId: number,
    @Body('username') username: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        relations: ['projects'],
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const project = await this.projectRepository.findOne({
        where: { project_id: projectId, project_owner: user },
      });

      if (!project) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Project not found',
        };
      }

      await this.projectRepository.remove(project);

      return {
        success: true,
        message: 'Project deleted successfully',
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

  @Post('/task', { middleware: [AuthMiddleware] })
  async createTask(
    @Body('taskName') taskName: string,
    @Body('taskDetail') taskDetail: string,
    @Body('username') username: string,
    @Body('projectId') projectId: number
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const project = await this.projectRepository.findOne({
        where: { project_id: projectId, project_owner: user },
      });

      if (!project) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Project not found',
        };
      }

      const newTask = new Task();
      newTask.task_name = taskName;
      newTask.task_detail = taskDetail;
      newTask.task_owner = user;
      newTask.project = project;

      await this.taskRepository.save(newTask);

      this.ctx.status = 201;
      return {
        success: true,
        message: 'Task created successfully',
        task: {
          taskId: newTask.task_id,
          taskName: newTask.task_name,
          taskDetail: newTask.task_detail,
          username: user.username,
        },
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

  @Put('/task', { middleware: [AuthMiddleware] })
  async updateTask(
    @Body('taskId') taskId: number,
    @Body('taskName') taskName: string,
    @Body('taskDetail') taskDetail: string,
    @Body('username') username: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
      });

      if (!task) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Task not found',
        };
      }

      task.task_name = taskName;
      task.task_detail = taskDetail;

      await this.taskRepository.save(task);

      return {
        success: true,
        message: 'Task updated successfully',
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
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'User not found',
        };
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
      });

      if (!task) {
        this.ctx.status = 404;
        return {
          success: false,
          message: 'Task not found',
        };
      }

      await this.taskRepository.remove(task);

      return {
        success: true,
        message: 'Task deleted successfully',
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
}
