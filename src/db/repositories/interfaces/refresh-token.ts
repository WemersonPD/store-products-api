import RefreshTokenEntity from '../../entities/refresh-token';
import { DeleteResult, UpdateResult, FindOneOptions } from 'typeorm';

export interface IRefreshTokenRepository {
  create(user: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  selectById(id: string): Promise<RefreshTokenEntity | null>;
  selectOneByOptions(
    options: FindOneOptions<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity | null>;
  updateById(id: string, user: RefreshTokenEntity): Promise<UpdateResult>;
  deleteById(id: string): Promise<DeleteResult>;
}
