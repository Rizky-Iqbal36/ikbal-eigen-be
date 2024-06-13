import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MemberModel } from '@database/models/member.model';

@Injectable()
export class MemberRepository extends Repository<MemberModel> {
  constructor(private dataSource: DataSource) {
    super(MemberModel, dataSource.createEntityManager());
  }

  findAll() {
    return this.find();
  }
}
