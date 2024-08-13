import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column('text')
  content: string;

  @Column('bigint')
  timestamp: number;

  @ManyToOne(() => Task, task => task.comments)
  task: Task;
}
