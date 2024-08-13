import { MidwayConfig } from '@midwayjs/core';

export default {
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
        entities: ['**/*.entity.{j,t}s'],
      },
    },
  },
} as MidwayConfig;
