import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';
import { Blog } from '../blog/blog.entity';
import { User } from '../user/user.entity';
import { Like } from '../likes/likes.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: "uuid", nullable: false})
  blogId!: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blogId' })
  blog!: Blog

  @Column({type: "uuid", nullable: false})
  userId!: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: User

  @Column({ type: 'text', nullable: false })
  content!: string;

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

  @OneToMany(() => Like, like => like.comment)
  likes!: Like[];

  @Column({ type: "int", default: 0 })
  likesCount!: number;

  @BeforeUpdate()
  checkLikesCount() {
    if (this.likesCount < 0) {
      this.likesCount = 0;
    }
  }
}
