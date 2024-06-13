import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MemberModel } from '@database/models/member.model';
import { BorrowHistoryModel } from '@database/models/borrowHistory.model';

@Injectable()
export class MemberRepository extends Repository<MemberModel> {
  constructor(private dataSource: DataSource) {
    super(MemberModel, dataSource.createEntityManager());
  }

  public async getMembersWithRecords() {
    return this.createQueryBuilder('m')
      .select([
        'm.id AS id',
        'm.code AS code',
        'm.name AS name',
        'SUM(IF(bh.status = "BORROWED", 1, 0)) AS borrowed',
      ])
      .leftJoin(BorrowHistoryModel, 'bh', 'bh.userId = m.id')
      .groupBy('m.id')
      .getRawMany<{
        id: number;
        code: string;
        name: string;
        borrowed: string;
      }>();
  }
}
