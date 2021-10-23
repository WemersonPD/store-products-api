import { injectable } from 'inversify';
import {
  DeleteResult,
  FindOneOptions, getRepository,
  UpdateResult,
  Repository,
} from 'typeorm';

import UserCredentialEntity from '../entities/user-credential';
import { IUserCredentialRepository } from './interfaces/user-credential';

@injectable()
export class UserCredentialRepository implements IUserCredentialRepository {

  private userCredentialRepository: Repository<UserCredentialEntity> = getRepository(
    UserCredentialEntity,
  );

  async create(userCredential: UserCredentialEntity): Promise<UserCredentialEntity> {
    return this.userCredentialRepository.save(userCredential);
  }

  async selectById(id: string): Promise<UserCredentialEntity | null> {
    return this.userCredentialRepository.findOne({ where: { id } });
  }

  async selectOneByOptions(
    options: FindOneOptions<UserCredentialEntity>,
  ): Promise<UserCredentialEntity | null> {
    return this.userCredentialRepository.findOne(options);
  }

  async updateById(id: string, userCredential: UserCredentialEntity): Promise<UpdateResult> {
    return this.userCredentialRepository.update(id, userCredential);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.userCredentialRepository.softDelete({ id });
  }
}
