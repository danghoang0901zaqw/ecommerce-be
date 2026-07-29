import { Category } from 'src/app/category/entities/category.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import {
  decimalColumn,
  decimalColumnTransformer,
  nullableDecimalColumn,
} from 'src/shared/utils/decimal-column.transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Index('product_featured', ['isFeatured'], {
  unique: true,
  where:
    '"is_featured" = true AND "is_active" = true AND  "deleted_at" IS NULL',
})
export class Product extends BaseUuidEntity {
  @Column({ type: 'uuid' })
  @Index()
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column(decimalColumn)
  price: number;

  @Column(nullableDecimalColumn)
  compareAtPrice?: number;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ unique: true })
  sku: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  hasVariants: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    transformer: decimalColumnTransformer,
  })
  ratingAverage: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  weight?: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
