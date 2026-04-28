import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { BaseUuidEntity } from '../../../common/entities/base.entity';

@Entity('categories')
export class Category extends BaseUuidEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
