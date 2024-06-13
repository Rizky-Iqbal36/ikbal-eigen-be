import { Injectable } from '@nestjs/common';

import { BookRepository } from '@repository/book.repository';
import { BookHistoryRepository } from '@repository/borrowHistory.repository';

import { BadRequest, NotFound } from '@app/exception';

import { IResponse } from '@src/interfaces';
import { EFlag } from '@src/interfaces/enum';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookHistoryRepository: BookHistoryRepository,
  ) {}

  public async borrowBook(id: number, user: IResponse['locals']['user']) {
    if (user.status !== 'ACTIVE')
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'You are not allowed to borrow book' },
      );
    const userId = user.uid;

    const bookRecords = await this.bookRepository.getBookWithRecords(id);
    if (!bookRecords)
      throw new NotFound(
        { flag: EFlag.RESOURCE_NOT_FOUND },
        { message: 'Book Not Found' },
      );
    if (Number(bookRecords.borrowed) >= bookRecords.stocks)
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'Stock Empty' },
      );

    const userBookHistory = await this.bookHistoryRepository.userBookHistory(
      userId,
      id,
      'BORROWED',
    );
    if (userBookHistory >= 1)
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'You Already borrow this book' },
      );
    const userTotalBorrow = await this.bookHistoryRepository.userTotalHistory(
      userId,
      'BORROWED',
    );
    if (userTotalBorrow >= 2)
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'Max borrow book reached' },
      );
    await this.bookHistoryRepository.insert({ bookId: id, userId });

    return {
      message: 'Book borrowed',
    };
  }
}
