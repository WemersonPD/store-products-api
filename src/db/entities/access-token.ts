import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Base from './base';
import UserEntity from './user';

@Entity('access_token')
export default class AccessTokenEntity extends Base {

  @Column({ type: 'uuid' })
  public userId?: string;

  @OneToOne(type => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;

  @Column({ type: 'timestamptz' })
  public expiresAt?: Date | string;
}
