import AccessTokenEntity from '../../entities/access-token';
import { DeleteResult, UpdateResult, FindOneOptions } from 'typeorm';

export interface IAccessTokenRepository {
  create(user: AccessTokenEntity): Promise<AccessTokenEntity>;
  selectById(id: string): Promise<AccessTokenEntity | null>;
  selectOneByOptions(options: FindOneOptions<AccessTokenEntity>): Promise<AccessTokenEntity | null>;
  updateById(id: string, user: AccessTokenEntity): Promise<UpdateResult>;
  deleteById(id: string): Promise<DeleteResult>;
}
