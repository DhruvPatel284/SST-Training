import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,  
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  //Many-to-Many
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  // JoinTable creates a junction table automatically: user_roles_role
  roles: Role[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
