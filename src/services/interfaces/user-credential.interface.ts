import UserCredentialEntity from '../../db/entities/user-credential';
import UserEntity from '../../db/entities/user';
import AccessTokenEntity from '../../db/entities/access-token';
import RefreshTokenEntity from '../../db/entities/refresh-token';
import { IAccessTokenAndRefreshToken, IChangePin } from '../../models/user-credential';

export interface IUserCredentialService {
  create(userCredential: UserCredentialEntity, actor: UserEntity): Promise<UserCredentialEntity>;
  getByUserId(userId: string): Promise<UserCredentialEntity>;
  updatePinByUserId(
    userId: string,
    pin: string,
    actor: UserEntity,
  ): Promise<UserCredentialEntity | null>;
  deleteByUserId(userId: string): Promise<void>;

  authenticate(email: string, pin: string): Promise<IAccessTokenAndRefreshToken>;

  recoveryPin(email: string): Promise<void>;
  changePin(changePin: IChangePin): Promise<UserCredentialEntity>;

  createAccessTokenByUserId(userId: string): Promise<AccessTokenEntity>;
  getAccessToken(accessToken: string): Promise<AccessTokenEntity>;

  createRefreshTokenByUserId(userId: string): Promise<RefreshTokenEntity>;
  getRefreshToken(refreshTokenId: string): Promise<IAccessTokenAndRefreshToken>;
}
