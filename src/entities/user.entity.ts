import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn() // Change to uuid.v6()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;
}
