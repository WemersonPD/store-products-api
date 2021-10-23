import { Pagination, ISearchParameterBase } from '../../models/pagination';
import UserEntity from '../../db/entities/user';

export interface IUserService {
  create(user: UserEntity, actor: UserEntity | null): Promise<UserEntity>;
  getAll(actor: UserEntity | null): Promise<UserEntity[] | null>;
  getById(id: string): Promise<UserEntity>;
  getWithPagination(searchParameter: ISearchParameterBase, actor: UserEntity | null):
    Promise<Pagination<UserEntity> | null>;
  updateById(id: string, user: UserEntity, actor: UserEntity):
    Promise<UserEntity | null>;
  deleteById(id: string): Promise<void>;
}
