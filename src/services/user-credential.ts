import { Between } from 'typeorm';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';

import TYPES from '../utilities/types';
import BusinessError, { ErrorCodes } from '../utilities/errors/business';
import { generateRandomCode, sha256 } from '../utilities/utils';

import { ConstantsEnv } from '../constants';

import UserCredentialEntity from '../db/entities/user-credential';
import AccessTokenEntity from '../db/entities/access-token';
import RefreshTokenEntity from '../db/entities/refresh-token';

import { IAccessTokenRepository } from '../db/repositories/interfaces/access-token';
import { IRefreshTokenRepository } from '../db/repositories/interfaces/refresh-token';

import { IUserCredentialRepository } from '../db/repositories/interfaces/user-credential';
import { IUserCredentialService } from './interfaces/user-credential.interface';

import MailSender from '../mechanisms/mail-sender';
import GetTemplateEmailService from '../template/email/get-template-email';

import { IAccessTokenAndRefreshToken, IChangePin } from '../models/user-credential';

@injectable()
export class UserCredentialService implements IUserCredentialService {
  private userCredentialRepository: IUserCredentialRepository;
  private accessTokenRepository: IAccessTokenRepository;
  private refreshTokenRepository: IRefreshTokenRepository;

  constructor(
    @inject(TYPES.UserCredentialRepository) userCredentialRepository: IUserCredentialRepository,
    @inject(TYPES.AccessTokenRepository) accessTokenRepository: IAccessTokenRepository,
    @inject(TYPES.RefreshTokenRepository) refreshTokenRepository: IRefreshTokenRepository,
  ) {
    this.userCredentialRepository = userCredentialRepository;
    this.accessTokenRepository = accessTokenRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async create(
    userCredential: UserCredentialEntity,
    actor: UserCredentialEntity | null,
  ): Promise<UserCredentialEntity> {
    let response: UserCredentialEntity = null;

    const exists: UserCredentialEntity = await this.userCredentialRepository.selectOneByOptions({
      where: {
        email: userCredential.email,
        deletedAt: null,
      },
    });

    if (exists) { throw new BusinessError(ErrorCodes.USER_ALREADY_EXISTS); }

    const userToSave: UserCredentialEntity = {
      userId: userCredential.userId,

      email: userCredential.email,
      pin: sha256(userCredential.pin),

      createdBy: (actor && actor.id) || 'SYSTEM',
      updatedBy: (actor && actor.id) || 'SYSTEM',
    };

    const userSaved: UserCredentialEntity = await this.userCredentialRepository
      .create(userToSave as UserCredentialEntity);
    response = await this.getByUserId(userSaved.id);

    return response;
  }

  async authenticate(email: string, pin: string): Promise<IAccessTokenAndRefreshToken> {
    let response: IAccessTokenAndRefreshToken = null;

    const userCredential: UserCredentialEntity = await this.userCredentialRepository
      .selectOneByOptions({
        where: [{
          email,
          pin: sha256(pin),

          deletedAt: null,
        }],
      });

    if (!userCredential) {
      throw new BusinessError(ErrorCodes.USER_NOT_FOUND);
    }

    const { userId } = userCredential;

    const { id: accessToken } = await this.createAccessTokenByUserId(userId);
    const { id: refreshToken } = await this.createRefreshTokenByUserId(userId);

    response = { accessToken, refreshToken };

    return response;
  }

  async getByUserId(userId: string): Promise<UserCredentialEntity> {
    let response: UserCredentialEntity = null;

    const userCredential: UserCredentialEntity = await this.userCredentialRepository
    .selectOneByOptions({
      where: {
        userId,
        deletedAt: null,
      },
      select: ['id', 'userId', 'email'],
    });

    if (!userCredential) {
      throw new BusinessError(ErrorCodes.USER_NOT_FOUND);
    }

    response = userCredential;

    return response;
  }

  async updatePinByUserId(
    userId: string,
    pin: string,
    actor: UserCredentialEntity,
  ): Promise<UserCredentialEntity | null> {
    let response: UserCredentialEntity = null;

    const userCredential = await this.getByUserId(userId);

    const { id: userCredentialId } = userCredential;

    const userToUpdate: UserCredentialEntity = {
      pin: sha256(pin),

      updatedBy: (actor && actor.id) || 'SYSTEM',
    };

    await this.userCredentialRepository.updateById(userCredentialId, userToUpdate);

    response = await this.getByUserId(userId);

    return response;
  }

  async recoveryPin(email: string): Promise<void> {
    const userCredential = await this.userCredentialRepository
      .selectOneByOptions({ where: { email, deletedAt: null } });

    if (!userCredential) {
      throw new BusinessError(ErrorCodes.USER_NOT_FOUND);
    }

    const { id: userCredentialId } = userCredential;

    const newPassword = generateRandomCode(4, 3);

    const userToUpdate: UserCredentialEntity = {
      pin: sha256(newPassword),

      updatedBy: 'SYSTEM',
    };

    const htmlParams = { recoveryToken: newPassword };
    const html = await GetTemplateEmailService.get('recovery-pin', htmlParams);

    await MailSender.send(email, 'Recuperação de senha', html);

    await this.userCredentialRepository.updateById(userCredentialId, userToUpdate);
  }

  async changePin(changePin: IChangePin): Promise<UserCredentialEntity> {
    let response: UserCredentialEntity = null;
    const { email, recoveryToken, pin } = changePin;

    const userCredential = await this.userCredentialRepository.selectOneByOptions({
      where: {
        email,
        pin: sha256(recoveryToken),
        deletedAt: null,
      },
    });

    if (!userCredential) {
      throw new BusinessError(ErrorCodes.USER_NOT_FOUND);
    }

    const { id: userCredentialId, userId } = userCredential;

    const userToUpdate: UserCredentialEntity = {
      pin: sha256(pin),

      updatedBy: 'SYSTEM',
    };

    await this.userCredentialRepository.updateById(userCredentialId, userToUpdate);

    response = await this.getByUserId(userId);

    return response;
  }

  async deleteByUserId(userId: string): Promise<void> {
    const userCredential = await this.getByUserId(userId);

    const userCredentialId: string = userCredential.id;

    await this.userCredentialRepository.deleteById(userCredentialId);
  }

  async createAccessTokenByUserId(userId: string): Promise<AccessTokenEntity> {
    let response: AccessTokenEntity = null;

    response = await this.accessTokenRepository.create({
      userId,

      expiresAt: DateTime.fromJSDate(new Date())
        .plus({ hour: ConstantsEnv.auth.accessTokenExpiration })
        .toJSDate(),
    });

    return response;
  }

  async getAccessToken(accessTokenId: string): Promise<AccessTokenEntity> {
    let response: AccessTokenEntity = null;

    const accessToken: AccessTokenEntity = await this.accessTokenRepository.selectOneByOptions({
      where: {
        id: accessTokenId,

        deletedAt: null,
        expiresAt: Between(
          DateTime.fromJSDate(new Date())
            .plus({ hour: -ConstantsEnv.auth.accessTokenExpiration })
            .toISO(),
          DateTime.fromJSDate(new Date())
            .plus({ hour: ConstantsEnv.auth.accessTokenExpiration })
            .toISO(),
        ),
      },
    });

    if (!accessToken) {
      throw new BusinessError(ErrorCodes.ENTITY_NOT_FOUND, 'accessToken');
    }

    response = accessToken;

    return response;
  }

  async createRefreshTokenByUserId(userId: string): Promise<RefreshTokenEntity> {
    let response: RefreshTokenEntity = null;

    response = await this.refreshTokenRepository.create({
      userId,

      expiresAt: DateTime.fromJSDate(new Date())
        .plus({ hour: ConstantsEnv.auth.refreshTokenExpiration })
        .toJSDate(),
    });

    return response;
  }

  async getRefreshToken(refreshTokenId: string): Promise<IAccessTokenAndRefreshToken> {
    let response: IAccessTokenAndRefreshToken = null;

    const findRefreshToken: RefreshTokenEntity = await this.refreshTokenRepository
    .selectOneByOptions({
      where: {
        id: refreshTokenId,

        deletedAt: null,
        expiresAt: Between(
          DateTime.fromJSDate(new Date())
            .plus({ hour: -ConstantsEnv.auth.refreshTokenExpiration })
            .toISO(),
          DateTime.fromJSDate(new Date())
            .plus({ hour: ConstantsEnv.auth.refreshTokenExpiration })
            .toISO(),
        ),
      },
    });

    if (!findRefreshToken) {
      throw new BusinessError(ErrorCodes.ENTITY_NOT_FOUND, 'refreshToken');
    }

    const { userId } = findRefreshToken;

    const { id: accessToken } = await this.createAccessTokenByUserId(userId);
    const { id: refreshToken } = await this.createRefreshTokenByUserId(userId);

    response = { accessToken, refreshToken };

    return response;
  }
}
