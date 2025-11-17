import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
