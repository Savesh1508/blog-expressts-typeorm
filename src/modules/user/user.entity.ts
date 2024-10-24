import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Blog } from '../blog/blog.entity';
import { Roles } from '../../shared/types/user-roles.types';

@Entity()
export class User {
  @PrimaryColumn({type: 'uuid', nullable: false})
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @Column({ type: 'enum', enum:Roles, default:Roles.USER, nullable:false})
  role: Roles

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
  createdAt!: Date;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs!: Blog[]

  constructor(
    id:string,
    username:string,
    email:string,
    password:string,
    role:Roles,
    refreshToken?:string,
  ) {
    this.id = id
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.refreshToken = refreshToken || "";
  }
}
