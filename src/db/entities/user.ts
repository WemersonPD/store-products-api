import {
  Entity,
  Column,
} from 'typeorm';

import Base from './base';

@Entity('user')
export default class UserEntity extends Base {
  @Column()
  public name?: string;

  @Column({ type: 'int4' })
  public profileType?: number;

  @Column()
  public email?: string;

  @Column()
  public profilePic?: string;

  @Column()
  public pushToken?: string;

  @Column({ type: 'int4' })
  public deviceType?: number;

  @Column()
  public deviceModel?: string;

  @Column()
  public deviceSO?: string;

  @Column()
  public deviceSOVersion?: string;

  @Column({ type: 'int4' })
  public battery?: number;

  @Column()
  public appVersion?: string;

  @Column({ type: 'float4' })
  public latitude?: number;

  @Column({ type: 'float4' })
  public longitude?: number;

}
