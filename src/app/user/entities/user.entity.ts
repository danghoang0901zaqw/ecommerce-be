import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import { UserRole } from 'src/shared/types/user-role.enum';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class User extends BaseUuidEntity {
  @Column()
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
