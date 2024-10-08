import { Entity, PrimaryColumn, Column } from 'typeorm';

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

  constructor(id:string, username: string, email: string, password: string, refreshToken?: string) {
    this.id = id
    this.username = username;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken || "";
  }
}
