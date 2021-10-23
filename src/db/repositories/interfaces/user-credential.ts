import UserCredentialEntity from '../../entities/user-credential';
import { DeleteResult, UpdateResult, FindOneOptions } from 'typeorm';

export interface IUserCredentialRepository {
  create(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>;
  selectById(id: string): Promise<UserCredentialEntity | null>;
  selectOneByOptions(
    options: FindOneOptions<UserCredentialEntity>,
  ): Promise<UserCredentialEntity | null>;
  updateById(id: string, userCredential: UserCredentialEntity): Promise<UpdateResult>;
  deleteById(id: string): Promise<DeleteResult>;
}
