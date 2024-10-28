import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../blog/blog.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: "uuid", nullable: false})
  blogId: string;

  @Column({type: "uuid", nullable: false})
  userId: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blogId' })
  blog!: Blog

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({type: "uuid", nullable: true})
  parentCommentId?: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({name: 'parentCommentId'})
  parentComment?: Comment | null

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies?: Comment[]

  constructor(id:string, blogId:string, userId:string, content:string) {
    this.id = id
    this.blogId = blogId;
    this.userId = userId;
    this.content = content;
  }
}
