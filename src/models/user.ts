import UserEntity from '../db/entities/user';

export interface IUserCreate extends UserEntity {
  pin: string | null;
}

export interface IUserUpdate extends UserEntity {
  pin: string | null;
}