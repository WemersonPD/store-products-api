import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import Base from './base';
import UserEntity from './user';

@Entity('product')
export default class ProductEntity extends Base {
  @Column()
  price?: number;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column()
  quantity?: number;

  @Column()
  status?: number;

  @Column()
  discount?: number;

  @Column()
  code?: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  owner?: UserEntity;

  @Column({ type: 'uuid' })
  ownerId?: string;
}