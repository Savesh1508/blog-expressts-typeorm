import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Blog {
  @PrimaryColumn({type: 'uuid', nullable: false})
  id!: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' }) // Связываем с User
  author!: User;

  @Column({type: "uuid", nullable: false})
  authorId: string;

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
