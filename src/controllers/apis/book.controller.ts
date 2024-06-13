import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { Controller, Req, Post, Get, Res } from '@nestjs/common';

import { BookService } from '@service/book.service';

import { BaseController } from '../base.controller';
import { EFlag } from '@src/interfaces/enum';
import { IResponse } from '@src/interfaces';

@Controller('book')
export class BookController extends BaseController {
  constructor(private readonly bookService: BookService) {
    super();
  }

  @Post('borrow')
  async borrowBook(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      bookId: Joi.number().min(1).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);
    return this.bookService.borrowBook(body.bookId, res.locals.user);
  }

  @Post('return')
  async returnBook(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      bookId: Joi.number().min(1).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);
    return this.bookService.returnBook(body.bookId, res.locals.user);
  }
}
