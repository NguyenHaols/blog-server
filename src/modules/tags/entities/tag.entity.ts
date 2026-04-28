import { Entity, Column, ManyToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { BaseUuidEntity } from '../../../common/entities/base.entity';

@Entity('tags')
export class Tag extends BaseUuidEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
