import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Base from './base';
import UserEntity from './user';

@Entity('refresh_token')
export default class RefreshTokenEntity extends Base {

  @Column({ type: 'uuid' })
  public userId?: string;

  @OneToOne(type => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;

  @Column({ type: 'timestamptz' })
  public expiresAt?: Date | string;
}
