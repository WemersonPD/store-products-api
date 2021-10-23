import { inject, injectable } from 'inversify';

import TYPES from '../utilities/types';
import BusinessError, { ErrorCodes } from '../utilities/errors/business';

import UserEntity from '../db/entities/user';
import { IUserRepository } from '../db/repositories/interfaces/user';
import { IUserService } from './interfaces/user.interface';
import { IUserUpdate, IUserCreate } from '../models/user';

import { Pagination, ISearchParameterUser } from '../models/pagination';

import UserCredentialEntity from '../db/entities/user-credential';
import { UserCredentialService } from './user-credential';

@injectable()
export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private userCredentialService: UserCredentialService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.UserCredentialService) userCredentialService: UserCredentialService,
  ) {
    this.userRepository = userRepository;
    this.userCredentialService = userCredentialService;
  }

  async getById(userId: string): Promise<UserEntity> {
    let response: UserEntity = null;

    const user: UserEntity = await this.userRepository.selectById(userId);

    response = user;

    return response;
  }

  async create(user: IUserCreate, actor: UserEntity | null): Promise<UserEntity> {
    let response: UserEntity = null;

    const exists: UserEntity = await this.userRepository.selectOneByOptions({
      where: [{
        email: user.email,
        deletedAt: null,
      }],
    });

    if (exists) {
      throw new BusinessError(ErrorCodes.USER_ALREADY_EXISTS);
    }

    const userToSave: UserEntity = {
      name: user.name,
      email: user.email,

      profileType: user.profileType,

      pushToken: user.pushToken,

      deviceType: user.deviceType,
      deviceModel: user.deviceModel,
      deviceSO: user.deviceSO,
      deviceSOVersion: user.deviceSOVersion,
      battery: user.battery,

      appVersion: user.appVersion,

      latitude: user.latitude,
      longitude: user.longitude,

      createdBy: (actor && actor.id) || 'SYSTEM',
      updatedBy: (actor && actor.id) || 'SYSTEM',
    };

    const userSaved: UserEntity = await this.userRepository.create(userToSave as UserEntity);

    const userCredentialToSave: UserCredentialEntity = {
      userId: userSaved.id,

      pin: user.pin,
      email: user.email,

      createdBy: (actor && actor.id) || 'SYSTEM',
      updatedBy: (actor && actor.id) || 'SYSTEM',
    };

    await this.userCredentialService.create(userCredentialToSave, actor);

    response = userSaved;

    return response;
  }

  async getWithPagination(searchParameter: ISearchParameterUser, actor: UserEntity | null):
    Promise<Pagination<UserEntity> | null> {
    let response: Pagination<UserEntity> = null;

    response = await this.userRepository.selectPagination(searchParameter);

    return response;
  }

  async getAll(actor: UserEntity | null): Promise<UserEntity[] | null> {
    let response: UserEntity[] = null;

    response = await this.userRepository.selectAll({
      order: { name: 'DESC' },
    });

    return response;
  }

  async updateById(id: string, user: IUserUpdate, actor: UserEntity): Promise<UserEntity | null> {
    let response: UserEntity = null;

    if (user.pin) {
      await this.userCredentialService.updatePinByUserId(id, user.pin, actor);
    }

    const userToUpdate: UserEntity = {
      ...user.name && { name: user.name },

      ...user.profileType && { profileType: user.profileType },

      ...user.pushToken && { pushToken: user.pushToken },

      ...user.deviceType && { deviceType: user.deviceType },
      ...user.deviceModel && { deviceModel: user.deviceModel },
      ...user.deviceSO && { deviceSO: user.deviceSO },
      ...user.deviceSOVersion && { deviceSOVersion: user.deviceSOVersion },
      ...user.battery && { battery: user.battery },

      ...user.appVersion && { appVersion: user.appVersion },

      ...user.latitude && { latitude: user.latitude },
      ...user.longitude && { longitude: user.longitude },

      updatedBy: (actor && actor.id) || 'SYSTEM',
    };

    await this.userRepository.updateById(id, userToUpdate);

    response = await this.getById(id);

    return response;
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.deleteById(id);
    await this.userCredentialService.deleteByUserId(id);
  }
}
