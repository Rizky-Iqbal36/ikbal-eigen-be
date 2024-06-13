import { Injectable } from '@nestjs/common';

import { MemberRepository } from '@repository/member.repository';

import cryptography from '@app/utils/cryptography';
import { zeroPad } from '@app/utils/modifier';
import { NotFound } from '@src/app/exception';
import { EFlag } from '@src/interfaces/enum';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  public async getMembers() {
    const users = await this.memberRepository.getMembersWithRecords();
    return { data: users };
  }

  async createMember(name: string) {
    const countUser = await this.memberRepository.count();
    const code = `M${zeroPad(countUser + 1, 3)}`;
    const { raw } = await this.memberRepository.insert({
      name,
      code,
    });
    const userId = raw.insertId;
    const token = cryptography.generateToken(userId);

    return {
      user: {
        id: userId,
        code,
        token,
      },
    };
  }

  async generateToken(id: number) {
    const member = await this.memberRepository.findOne({
      where: { id },
      select: ['name'],
    });
    if (!member)
      throw new NotFound(
        { flag: EFlag.RESOURCE_NOT_FOUND },
        { message: 'User not found' },
      );

    const token = cryptography.generateToken(id);
    return {
      user: {
        code: member.code,
        token,
      },
    };
  }
}
