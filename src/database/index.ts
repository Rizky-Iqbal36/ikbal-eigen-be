import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { dbConfig } from '../app/config';
const { databases, moduleOption } = dbConfig;

import { MemberModel } from './models/member.model';
import { BookModel } from './models/book.model';
import { BorrowHistoryModel } from './models/borrowHistory.model';

const tables = [MemberModel, BookModel, BorrowHistoryModel];

const eigenDBConfig = {
  ...moduleOption,
  ...databases.eigen,
  entities: tables,
} as TypeOrmModuleOptions;
export const databaseEigen = TypeOrmModule.forRootAsync({
  useFactory: () => eigenDBConfig,
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource({ ...options }).initialize();
    return dataSource;
  },
});
