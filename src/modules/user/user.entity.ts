import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({nullable:false})
  id: string

  @Column({nullable:false})
  username: string

  @Column({nullable:false})
  email: string

  @Column({nullable:false})
  password: string

  @Column()
  refreshToken: string;
}