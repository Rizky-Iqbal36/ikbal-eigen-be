import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'member' })
export class MemberModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  code: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'PENALTY'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'PENALTY';

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
