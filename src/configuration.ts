import { Configuration, App } from '@midwayjs/core';
import * as crossDomain from '@midwayjs/cross-domain';
import * as koa from '@midwayjs/koa';
import * as orm from '@midwayjs/typeorm';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as DefaultConfig from './config/config.default';
import * as LocalConfig from './config/config.local';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    crossDomain,
    koa,
    orm,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
    },
  ],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
