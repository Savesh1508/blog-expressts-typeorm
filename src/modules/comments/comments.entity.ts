import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Blog } from '../blog/blog.entity';

@Entity()
export class Comment {
  @PrimaryColumn({type: 'uuid', nullable: false})
  id!: string;

  @Column({type: "uuid", nullable: false})
  blogId: string;

  @Column({type: "uuid", nullable: false})
  userId: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blogId' })
  blog!: Blog

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt!: Date;

  constructor(id:string, blogId:string, userId:string, content:string) {
    this.id = id
    this.blogId = blogId;
    this.userId = userId;
    this.content = content;
  }
}
