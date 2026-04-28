import { Entity, Column, OneToMany } from 'typeorm';
import { Role } from '../../../common/enums';
import { Post } from '../../posts/entities/post.entity';
import { Exclude } from 'class-transformer';
import { BaseUuidEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseUuidEntity {
  @Column({ name: 'auth0_id', nullable: true, unique: true })
  auth0Id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash: string | null;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.AUTHOR,
  })
  role: Role;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
