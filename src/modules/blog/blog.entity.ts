import { Entity, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';
import { Like } from '../likes/likes.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: "uuid", nullable: false})
  authorId!: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'authorId' })
  author!: User

  @Column({ type: 'varchar', length: 120, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments!: Comment[];

  @OneToMany(() => Like, like => like.blog)
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
