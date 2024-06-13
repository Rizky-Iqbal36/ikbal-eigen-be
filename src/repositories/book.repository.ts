import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookModel } from '../database/models/book.model';
import { BorrowHistoryModel } from '../database/models/borrowHistory.model';

type TBookRecord = {
  id: number;
  code: string;
  title: string;
  author: string;
  stocks: number;
  borrowed: number;
};
@Injectable()
export class BookRepository extends Repository<BookModel> {
  constructor(private dataSource: DataSource) {
    super(BookModel, dataSource.createEntityManager());
  }

  public async getBookWithRecords<T extends number | undefined>(
    id: T = undefined,
  ): Promise<T extends undefined ? TBookRecord[] : TBookRecord> {
    const qb = this.createQueryBuilder('b')
      .select([
        'b.id AS id',
        'b.code AS code',
        'b.title AS title',
        'b.author AS author',
        'b.stocks AS stocks',
        "SUM(IF(bh.status = 'BORROWED', 1, 0)) AS borrowed",
      ])
      .leftJoin(BorrowHistoryModel, 'bh', 'b.id = bh.bookId')
      .where(id ? `b.id = ${id}` : 'TRUE')
      .groupBy('b.id');

    return (
      id ? qb.getRawOne<TBookRecord>() : qb.getRawMany<TBookRecord>()
    ) as any;
  }
}
