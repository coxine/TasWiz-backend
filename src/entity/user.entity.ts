import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column()
  token: string;

  @OneToMany(() => Project, project => project.project_owner)
  projects: Project[];

  @OneToMany(() => Task, task => task.task_owner)
  tasks: Task[];
}
