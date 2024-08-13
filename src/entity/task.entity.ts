import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  task_id: number;

  @Column()
  task_name: string;

  @ManyToOne(() => User, user => user.tasks)
  task_owner: User;

  @Column('text')
  task_detail: string;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];
}
