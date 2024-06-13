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
  ) {
    return this.createQueryBuilder('b')
      .select([
        'b.id As id',
        'b.stocks AS stocks',
        'SUM(IF(bh.status = "BORROWED", 1, 0)) AS borrowed',
      ])
      .leftJoin(BorrowHistoryModel, 'bh', 'b.id = bh.bookId')
      .where(`b.id = ${id}`)
      .groupBy('b.id')
      .getRawOne<{ id: number; stocks: number; borrowed: number }>();
  }
}
