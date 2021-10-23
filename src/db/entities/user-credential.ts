import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Base from './base';
import UserEntity from './user';

@Entity('user_credential')
export default class UserCredentialEntity extends Base {

  @Column({ type: 'uuid' })
  public userId?: string;

  @OneToOne(type => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;

  @Column()
  public pin?: string;

  @Column()
  public email?: string;
}
