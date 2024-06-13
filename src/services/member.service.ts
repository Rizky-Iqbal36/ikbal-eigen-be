import { Injectable } from '@nestjs/common';

import { MemberRepository } from '@repository/member.repository';
import { zeroPad } from '@src/app/utils/modifier';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  async createMember(name: string) {
    const countUser = await this.memberRepository.count();
    const code = `M${zeroPad(countUser + 1, 3)}`;
    const { raw } = await this.memberRepository.insert({
      name,
      code,
    });

    return {
      user: {
        id: raw.insertId,
        code,
      },
    };
  }
}
