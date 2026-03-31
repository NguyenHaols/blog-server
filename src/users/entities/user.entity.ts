import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../common/enums';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'auth0_id', nullable: true, unique: true })
  auth0Id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.AUTHOR,
  })
  role: Role;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
