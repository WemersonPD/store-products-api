import { injectable } from 'inversify';
import {
  DeleteResult,
  FindOneOptions, getRepository,
  UpdateResult,
  Repository,
} from 'typeorm';

import AccessTokenEntity from '../entities/access-token';
import { IAccessTokenRepository } from './interfaces/access-token';

@injectable()
export class AccessTokenRepository implements IAccessTokenRepository {

  private accessTokenRepository: Repository<AccessTokenEntity> = getRepository(AccessTokenEntity);

  async create(accessToken: AccessTokenEntity): Promise<AccessTokenEntity> {
    return this.accessTokenRepository.save(accessToken);
  }

  async selectById(id: string): Promise<AccessTokenEntity | null> {
    return this.accessTokenRepository.findOne({
      where: { id },
    });
  }

  async selectOneByOptions(
    options: FindOneOptions<AccessTokenEntity>,
  ): Promise<AccessTokenEntity | null> {
    return this.accessTokenRepository.findOne(options);
  }

  async updateById(id: string, accessToken: AccessTokenEntity): Promise<UpdateResult> {
    return this.accessTokenRepository.update(id, accessToken);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.accessTokenRepository.softDelete({ id });
  }
}
