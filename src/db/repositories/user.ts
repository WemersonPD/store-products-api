import { injectable } from 'inversify';
import {
  DeleteResult,
  FindConditions, FindManyOptions, FindOneOptions,
  getRepository, ILike, Repository, UpdateResult,
} from 'typeorm';

import UserEntity from '../entities/user';
import { Pagination, ISearchParameterUser } from '../../models/pagination';
import { IUserRepository } from './interfaces/user';

@injectable()
export class UserRepository implements IUserRepository {

  private userRepository: Repository<UserEntity> = getRepository(UserEntity);

  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async selectPagination(searchParameter: ISearchParameterUser): Promise<Pagination<UserEntity>> {
    let where: any = { deletedAt: null };

    if (searchParameter.name) {
      where = { ...where, name: ILike(`%${searchParameter.name}%`) };
    }

    if (searchParameter.email) {
      where = { ...where, email: ILike(`%${searchParameter.email}%`) };
    }

    if (searchParameter.profileType) {
      const newWhere = [];

      newWhere.push(
        ...searchParameter.profileType.map(num => ({
          ...where,
          profileType: Number(num),
        })),
      );

      where = newWhere;
    }

    const [rows, count] = await this.userRepository.findAndCount({
      where,
      skip: searchParameter.offset,
      take: searchParameter.limit,
      order: {
        [searchParameter.orderBy]: searchParameter.isDESC ? 'DESC' : 'ASC',
      },
    });

    return {
      count,
      rows,
    };
  }

  async selectById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id, deletedAt: null } });
  }

  async selectByIdList(idList: string[]): Promise<UserEntity[]> {
    return this.userRepository.findByIds(idList);
  }

  async selectOneByOptions(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne(options);
  }

  async selectAll(options: FindManyOptions<UserEntity>):
    Promise<UserEntity[] | null> {
    return this.userRepository.find(options);
  }

  async selectAllByOptions(options: FindManyOptions<UserEntity>):
    Promise<UserEntity[] | null> {
    return this.userRepository.find(options);
  }

  async updateById(id: string, user: UserEntity): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  async selectByWhere(where: FindConditions<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where });
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.userRepository.softDelete({ id });
  }
}
