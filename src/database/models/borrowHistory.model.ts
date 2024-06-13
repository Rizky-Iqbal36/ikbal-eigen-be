import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'borrow_history' })
export class BorrowHistoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: ['BORROWED', 'RETURNED'], default: 'BORROWED' })
  status: 'BORROWED' | 'RETURNED';

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
