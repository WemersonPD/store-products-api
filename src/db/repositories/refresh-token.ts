import { injectable } from 'inversify';
import {
  DeleteResult,
  FindOneOptions, getRepository,
  UpdateResult,
  Repository,
} from 'typeorm';

import refreshTokenEntity from '../entities/refresh-token';
import { IRefreshTokenRepository } from './interfaces/refresh-token';

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {

  private refreshTokenRepository: Repository<refreshTokenEntity> = getRepository(
    refreshTokenEntity,
  );

  async create(refreshToken: refreshTokenEntity): Promise<refreshTokenEntity> {
    return this.refreshTokenRepository.save(refreshToken);
  }

  async selectById(id: string): Promise<refreshTokenEntity | null> {
    return this.refreshTokenRepository.findOne({
      where: { id },
    });
  }

  async selectOneByOptions(
    options: FindOneOptions<refreshTokenEntity>,
  ): Promise<refreshTokenEntity | null> {
    return this.refreshTokenRepository.findOne(options);
  }

  async updateById(id: string, refreshToken: refreshTokenEntity): Promise<UpdateResult> {
    return this.refreshTokenRepository.update(id, refreshToken);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.refreshTokenRepository.softDelete({ id });
  }
}
