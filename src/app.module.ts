import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import ExceptionsFilter from './app/exception/filter';
import TransformInterceptor from './app/interceptor';

import controllers from './controllers';
import services from './services';
import repositories from './repositories';
import { databaseEigen } from './database';

import AuthMiddleware from './app/middlewares/auth.middleware';

@Module({
  imports: [databaseEigen],
  controllers,
  providers: [
    ...services,
    ...repositories,
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/member', method: RequestMethod.POST },
        { path: '/member/token', method: RequestMethod.GET },
        { path: '', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
