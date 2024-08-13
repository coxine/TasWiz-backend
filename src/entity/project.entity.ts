import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column()
  project_name: string;

  @ManyToOne(() => User, user => user.projects)
  project_owner: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}
