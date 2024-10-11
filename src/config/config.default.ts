import { MidwayConfig } from '@midwayjs/core';
import { Task } from '../entity/task.entity';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { Comment } from '../entity/comment.entity';

export default {
  secretKey: '',
  keys: '',
  koa: {
    port: 7001,
  },
  cors: {
    credentials: false,
  },

  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '',
        port: 27229,
        username: '',
        password: '',
        database: '',
        synchronize: true,
        logging: false,
        entities: [Task, Project, User, Comment],
      },
    },
  },
} as MidwayConfig;
