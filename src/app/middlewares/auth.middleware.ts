import { Request, NextFunction } from 'express';

import { NestMiddleware, Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';
import { EFlag } from '@src/interfaces/enum';

import { Unauthorized, BadRequest, Forbidden } from '@app/exception';
import cryptography from '@app/utils/cryptography';

import { MemberRepository } from '@repository/member.repository';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(private readonly memberRepositry: MemberRepository) {}

  async use(req: Request, res: IResponse, next: NextFunction) {
    let header, token;

    if (
      !(header = req.header('Authorization')) ||
      !(token = header.replace('Bearer ', ''))
    )
      throw new Unauthorized({
        reason: 'Token Required',
      });

    let user;
    try {
      const verified = cryptography.verifyToken(token) as any;
      user = await this.memberRepositry.findOne({
        where: { id: verified.uid },
        select: ['name'],
      });
      if (user)
        res.locals.user = {
          uid: verified.uid,
          name: user.name,
        };
    } catch (err: any) {
      throw new BadRequest(
        { flag: EFlag.INVALID_JWT, reason: err.message },
        { message: 'Invalid Tokne' },
      );
    }

    if (!user) throw new Forbidden({});

    next();
  }
}
