import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import ExceptionsFilter from '@app/exception/filter';
import TransformInterceptor from '@app/interceptor';

import controllers from './controllers';
import services from './services';

@Module({
  imports: [],
  controllers,
  providers: [
    ...services,
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
