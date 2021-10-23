import httpStatus from 'http-status';
import { Response, NextFunction } from 'express';
import { getRepository, Repository, Between } from 'typeorm';
import { DateTime } from 'luxon';

import { ICustomRequest } from '../../models/custom-request';
import AccessTokenEntity from '../../db/entities/access-token';
import UserEntity from '../../db/entities/user';
import { ConstantsEnv } from '../../constants';

/**
 * Middleware to authorize user, endpoint must have authenticate middleware
 *
 * @export
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.Next} next
 * @param {Array<ProfileType>} profileList
 * @returns void
 */
export default async function (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<any> {
  if (!req.headers || !req.headers.authorization) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  let token: string = null;
  const parts = req.headers.authorization.split(' ');

  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    [, token] = parts;
    token = token && token.length >= 10 ? token : null;
  }

  if (!token) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const accessTokenRepository: Repository<AccessTokenEntity> = getRepository(AccessTokenEntity);
  const accountCredential: AccessTokenEntity = await accessTokenRepository.findOne({
    where: {
      id: token,

      deletedAt: null,
      expiresAt: Between(
        DateTime
          .fromJSDate(new Date())
          .plus({ hour: -ConstantsEnv.auth.accessTokenExpiration })
          .toISO(),
        DateTime
          .fromJSDate(new Date())
          .plus({ hour: ConstantsEnv.auth.accessTokenExpiration })
          .toISO(),
      ),
    },
  });

  if (!accountCredential) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const { userId } = accountCredential;

  const userRepository: Repository<UserEntity> = getRepository(UserEntity);
  const user: UserEntity = await userRepository.findOne({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  req.user = user;

  return req.user ? next() : res.sendStatus(httpStatus.UNAUTHORIZED);
}
