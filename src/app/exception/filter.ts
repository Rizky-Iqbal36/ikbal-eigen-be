import { Request } from 'express';
import _ from 'lodash'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { IResponse } from '../../interfaces';
import { EFlag } from '../../interfaces/enum';

import { CustomHttpException } from './index';

@Catch(HttpException, Error)
export default class ExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const logger = new Logger();
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<IResponse>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors;
    let result;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      result = status !== 200 ? undefined : exception.getResponse();

      let flag = undefined,
        details = {};
      if (exception instanceof CustomHttpException) {
        const { flag: customFlag, ...etc } = (exception as CustomHttpException).details;
        flag = customFlag;
        details = etc;
      }

      errors = {
        result: 0,
        desc: exception.message,
        flag,
        ...{ ...(!_.isEmpty(details) && { details }) },
      };
    } else if (exception instanceof Error) {
      errors = {
        result: 0,
        desc: 'Internal Server Error',
        flag: EFlag.INTERNAL_SERVER_ERROR,
        detail: {
          ...exception,
          reason: exception.message,
        },
      };
    }

    status >= 300 ? ((result = undefined), (errors = { ...errors, statusCode: status })) : (errors = undefined);
    const logPayload = [req.ip, req.method, req.url, status, req.body, !res.headersSent ? result : {}, res.locals, req.header('Authorization')]
      .map((value) => JSON.stringify(value))
      .join('|');
    logger.debug(logPayload);
    if (!res.headersSent)
      res.status(status).json({
        ...(typeof result === 'object' ? (result as object) : { result }),
        ...errors,
      });
  }
}