import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { PostStatus } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.posts, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
