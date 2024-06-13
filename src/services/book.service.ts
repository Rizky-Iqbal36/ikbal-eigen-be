import _ from 'lodash';
import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { BookRepository } from '../repositories/book.repository';
import { BookHistoryRepository } from '../repositories/borrowHistory.repository';
import { MemberRepository } from '../repositories/member.repository';

import { BadRequest, NotFound } from '../app/exception';

import { IResponse } from '../interfaces';
import { EFlag } from '../interfaces/enum';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookHistoryRepository: BookHistoryRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  private checkUser(
    user: IResponse['locals']['user'],
    byPass: boolean = false,
  ) {
    if (!byPass && user.status !== 'ACTIVE')
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'You are not allowed to borrow book' },
      );
    return user.uid;
  }

  public async getBooks() {
    const bookRecords =
      await this.bookRepository.getBookWithRecords<undefined>();
    const bookRecordsHaveStock = _.filter(
      bookRecords,
      ({ borrowed, stocks }) => Number(borrowed) < stocks,
    );
    return {
      data: bookRecordsHaveStock.map(({ code, title, author, stocks }) => {
        return {
          code,
          title,
          author,
          stocks,
        };
      }),
    };
  }

  public async borrowBook(bookId: number, user: IResponse['locals']['user']) {
    const userId = this.checkUser(user);

    const bookRecords = await this.bookRepository.getBookWithRecords(bookId);
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
      bookId,
      'BORROWED',
    );
    if (userBookHistory)
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
    await this.bookHistoryRepository.insert({ bookId, userId });

    return {
      message: 'Book borrowed',
    };
  }

  public async returnBook(bookId: number, user: IResponse['locals']['user']) {
    const userId = this.checkUser(user, true);
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book)
      throw new NotFound(
        { flag: EFlag.RESOURCE_NOT_FOUND },
        { message: 'Book Not Found' },
      );

    const userBookHistory = await this.bookHistoryRepository.userBookHistory(
      userId,
      bookId,
      'BORROWED',
    );
    if (!userBookHistory)
      throw new BadRequest(
        { flag: EFlag.BAD_REQUEST },
        { message: 'You not borrow this book yet' },
      );

    const borrowedDate = userBookHistory.createdDate;
    const differDay = moment().diff(borrowedDate, 'days');
    if (differDay > 7) {
      const penaltyExpireDate = moment()
        .add(3, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      await this.memberRepository.update({ id: userId }, { penaltyExpireDate });
    }
    await this.bookHistoryRepository.update(
      { userId, bookId, status: 'BORROWED' },
      { status: 'RETURNED' },
    );

    return {
      message: 'Book Returned',
    };
  }
}
