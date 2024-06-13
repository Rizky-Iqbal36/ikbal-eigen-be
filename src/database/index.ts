import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { dbConfig } from '@app/config';
const { databases, moduleOption } = dbConfig;

import { MemberModel } from './models/member.model';

const tables = [MemberModel];

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
