import UserEntity from '../db/entities/user';

export interface ICustomRequest {
  body: any;
  query: any;
  params: any;
  headers: any;
  user: UserEntity;
}