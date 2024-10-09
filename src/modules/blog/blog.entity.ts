import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Blog {
  @PrimaryColumn({type: 'uuid', nullable: false})
  id!: string;

  @Column({type: "uuid", nullable: false})
  authorId: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'authorId' })
  author!: User

  @Column({ type: 'varchar', length: 120, nullable: false, unique:true })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  constructor(id:string, authorId: string, title: string, content: string, tags?: string[]) {
    this.id = id
    this.authorId = authorId;
    this.title = title;
    this.content = content;
    this.tags = tags;
  }
}
