import { MidwayConfig } from '@midwayjs/core';
import { Task } from '../entity/task.entity';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { Comment } from '../entity/comment.entity';

export default {
  secretKey: '26117e60433ab66101c7fbc70afa9e9577c6c00d783cf2a183de4c536a2139f9',
  keys: '1723087639021_822',
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
        host: 'sh-cynosdbmysql-grp-ftk1jspo.sql.tencentcdb.com',
        port: 27229,
        username: 'Yuxianjiang_kanban',
        password: 'Yxjkanban240813qaq',
        database: 'kanban',
        synchronize: true,
        logging: false,
        entities: [
          Task,
          Project,
          User,
          Comment
        ],
      },
    },
  },
} as MidwayConfig;
