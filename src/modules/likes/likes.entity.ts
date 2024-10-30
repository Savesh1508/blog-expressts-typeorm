import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Blog } from '../blog/blog.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  userId: string;

  @Column({ type: "uuid", nullable: true })
  blogId?: string;

  @Column({ type: "uuid", nullable: true })
  commentId?: string;



  @ManyToOne(() => User, user => user.likes, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User

  @ManyToOne(() => Blog, blog => blog.likes, { nullable: true })
  @JoinColumn({ name: 'blogId' })
  blog!: Blog | null;

  @ManyToOne(() => Comment, comment => comment.likes, { nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment!: Comment | null;

  constructor(id:string, userId:string, blogId:string, commentId:string) {
    this.id = id
    this.userId = userId
    this.blogId = blogId
    this.commentId = commentId
  }
}
