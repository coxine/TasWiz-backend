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
} from '@midwayjs/core';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Comment } from '../entity/comment.entity';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Project } from '../entity/project.entity';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { generateToken } from '../utils/token.utils';
import { handle401, handle404, handle500 } from '../utils/handlerror.utils';
import { ValidateBodyMiddleware } from '../middleware/validate.middleware';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(Comment)
  commentRepository: Repository<Comment>;

  @InjectEntityModel(Task)
  taskRepository: Repository<Task>;

  @InjectEntityModel(Project)
  projectRepository: Repository<Project>;

  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @Post('/login', { middleware: [ValidateBodyMiddleware] })
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        handle401(this.ctx);
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        handle401(this.ctx);
      }

      const token = generateToken({ username });

      return {
        success: true,
        message: 'Login successful',
        token,
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Post('/register', { middleware: [ValidateBodyMiddleware] })
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
      handle500(this.ctx, error);
    }
  }

  @Post('/changePassword', {
    middleware: [AuthMiddleware, ValidateBodyMiddleware],
  })
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
        handle404(this.ctx, 'User not found');
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password_hash
      );

      if (!isOldPasswordValid) {
        handle401(this.ctx);
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      user.password_hash = newPasswordHash;

      await this.userRepository.save(user);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Get('/projects', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
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
        handle404(this.ctx, 'User not found');
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
      handle500(this.ctx, error);
    }
  }

  @Post('/project', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
  async createProject(
    @Body('username') username: string,
    @Body('projectName') projectName: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        handle404(this.ctx, 'User not found');
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
      handle500(this.ctx, error);
    }
  }

  @Del('/project', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
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
        handle404(this.ctx, 'User not found');
      }

      const project = await this.projectRepository.findOne({
        where: { project_id: projectId, project_owner: user },
      });

      if (!project) {
        handle404(this.ctx, 'Project not found');
      }

      await this.projectRepository.remove(project);

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Post('/task', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
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
        handle404(this.ctx, 'User not found');
      }

      const project = await this.projectRepository.findOne({
        where: { project_id: projectId, project_owner: user },
      });

      if (!project) {
        handle404(this.ctx, 'Project not found');
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
      handle500(this.ctx, error);
    }
  }

  @Put('/task', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
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
        handle404(this.ctx, 'User not found');
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
      });

      if (!task) {
        handle404(this.ctx, 'Task not found');
      }

      task.task_name = taskName;
      task.task_detail = taskDetail;

      await this.taskRepository.save(task);

      return {
        success: true,
        message: 'Task updated successfully',
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Get('/task', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
  async getTask(
    @Query('taskId') taskId: number,
    @Query('username') username: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        handle404(this.ctx, 'User not found');
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
        relations: ['comments'],
      });

      if (!task) {
        handle404(this.ctx, 'Task not found');
      }

      const taskData = {
        taskId: task.task_id,
        taskName: task.task_name,
        taskDetail: task.task_detail,
        comments: task.comments.map(comment => ({
          content: comment.content,
          timestamp: comment.timestamp,
        })),
        username: user.username,
        timestamp: task.comments.length > 0 ? task.comments[0].timestamp : null,
      };

      return {
        success: true,
        task: taskData,
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Del('/task', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
  async deleteTask(
    @Body('taskId') taskId: number,
    @Body('username') username: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        handle404(this.ctx, 'User not found');
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
      });

      if (!task) {
        handle404(this.ctx, 'Task not found');
      }

      await this.taskRepository.remove(task);

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }

  @Post('/comments', { middleware: [AuthMiddleware, ValidateBodyMiddleware] })
  async addComment(
    @Body('username') username: string,
    @Body('taskId') taskId: number,
    @Body('comment') commentContent: string,
    @Body('timestamp') timestamp: number
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        handle404(this.ctx, 'User not found');
      }

      const task = await this.taskRepository.findOne({
        where: { task_id: taskId, task_owner: user },
      });

      if (!task) {
        handle404(this.ctx, 'Task not found');
      }

      const newComment = new Comment();
      newComment.content = commentContent;
      newComment.timestamp = timestamp;
      newComment.task = task;

      await this.commentRepository.save(newComment);

      return {
        success: true,
        message: 'Comment added successfully',
      };
    } catch (error) {
      handle500(this.ctx, error);
    }
  }
}
