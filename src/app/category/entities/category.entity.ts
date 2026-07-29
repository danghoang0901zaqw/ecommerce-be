import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category extends BaseUuidEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  imageKey?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];
}
