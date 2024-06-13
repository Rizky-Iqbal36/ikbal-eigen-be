import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import appConfig from '@app/config';
import TransformInterceptor from '@app/interceptor';

import { AppModule } from '@src/app.module';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appPort = appConfig.app.port;
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(appPort, async () => {
    logger.debug(`🚀 Server ready at port: ${appPort}`);
  });
}
bootstrap();
