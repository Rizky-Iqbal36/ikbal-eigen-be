import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BorrowHistoryModel } from '@database/models/borrowHistory.model';

@Injectable()
export class BookHistoryRepository extends Repository<BorrowHistoryModel> {
  constructor(private dataSource: DataSource) {
    super(BorrowHistoryModel, dataSource.createEntityManager());
  }

  public async userTotalHistory(
    userId: number,
    status?: BorrowHistoryModel['status'],
  ) {
    return this.count({
      where: {
        userId,
        ...(status && { status }),
      },
    });
  }
}
