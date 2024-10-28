import { Entity, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type: "uuid", nullable: false})
  authorId: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'authorId' })
  author!: User

  @Column({ type: 'varchar', length: 120, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false })
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments!: Comment[];

  constructor(id:string, authorId: string, title: string, content: string, tags?: string[]) {
    this.id = id
    this.authorId = authorId;
    this.title = title;
    this.content = content;
    this.tags = tags;
  }
}
