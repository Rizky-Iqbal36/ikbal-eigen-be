import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { Controller, Req, Post, Get } from '@nestjs/common';

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

  @Get('token')
  async getMemberToken(@Req() req: Request) {
    const { id } = req.query;
    const validationSchema: ObjectSchema = Joi.object({
      id: Joi.number().required(),
    }).unknown();
    await this.validateReq(validationSchema, req.query, EFlag.INVALID_PARAM);
    return this.memberService.generateToken(Number(id));
  }
}
