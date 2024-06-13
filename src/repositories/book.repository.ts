import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookModel } from '@database/models/book.model';

@Injectable()
export class BookRepository extends Repository<BookModel> {
  constructor(private dataSource: DataSource) {
    super(BookModel, dataSource.createEntityManager());
  }
}
