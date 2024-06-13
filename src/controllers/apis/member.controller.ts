import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { Controller, Req, Post } from '@nestjs/common';

import { MemberService } from '@service/member.service';
import { BaseController } from '../base.controller';
import { EFlag } from '@src/interfaces/enum';

@Controller('member')
export class MemberController extends BaseController {
  constructor(private readonly memberService: MemberService) {
    super();
  }

  @Post()
  async createMember(@Req() req: Request) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      name: Joi.string().min(3).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);
    return this.memberService.createMember(body.name);
  }
}
