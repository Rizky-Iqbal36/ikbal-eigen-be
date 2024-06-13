import moment from 'moment';
import { Request, NextFunction } from 'express';

import { NestMiddleware, Injectable } from '@nestjs/common';

import { IResponse } from '../../interfaces';
import { EFlag } from '../../interfaces/enum';

import { Unauthorized, BadRequest, Forbidden } from '../exception';
import cryptography from '../utils/cryptography';

import { MemberRepository } from '../../repositories/member.repository';

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
        select: ['name', 'penaltyExpireDate'],
      });
      if (user) {
        const penaltyExpireDate = user.penaltyExpireDate;
        const userStatus =
          penaltyExpireDate && moment().isSameOrBefore(penaltyExpireDate)
            ? 'PENALTY'
            : 'ACTIVE';

        res.locals.user = {
          uid: verified.uid,
          name: user.name,
          status: userStatus,
        };
      }
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
