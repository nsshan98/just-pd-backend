import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  show_email: boolean;

  @Column()
  phone: string;

  @Column()
  show_phone: boolean;

  @Column()
  designation: string;

  @Column()
  department: string;

  @Column('json')
  image: {
    image_url: string;
    image_public_id: string;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.employees)
  user: User;
}
