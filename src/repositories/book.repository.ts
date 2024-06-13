import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookModel } from '@database/models/book.model';
import { BorrowHistoryModel } from '@src/database/models/borrowHistory.model';

@Injectable()
export class BookRepository extends Repository<BookModel> {
  constructor(private dataSource: DataSource) {
    super(BookModel, dataSource.createEntityManager());
  }

  public async getBookWithRecords(
    id: number,
    status?: BorrowHistoryModel['status'],
  ) {
    return this.createQueryBuilder('b')
      .select(['b.id As id', 'b.stocks AS stocks', 'COUNT(bh.id) AS borrowed'])
      .leftJoin(BorrowHistoryModel, 'bh', 'b.id = bh.bookId')
      .where(`b.id = ${id}`)
      .andWhere(status ? `bh.status = "${status}"` : 'TRUE')
      .groupBy('b.id')
      .getRawOne<{ id: number; stocks: number; borrowed: number }>();
  }
}
