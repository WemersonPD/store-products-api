import { inject } from 'inversify';
import {
  httpGet,
  httpPost,
  httpPut,
  BaseHttpController,
  interfaces,
  controller,
} from 'inversify-express-utils';

import { IUserCredentialService } from '../../services/interfaces/user-credential.interface';
import TYPES from '../../utilities/types';
import authenticate from '../middleware/authenticate';
import { ICustomRequest } from '../../models/custom-request';

@controller('/user-credential')
export class UserCredentialController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.UserCredentialService)
    private userCredentialService: IUserCredentialService,
  ) {
    super();
  }

  @httpPost('/auth')
  private auth(req: ICustomRequest): Promise<any> {
    return this.userCredentialService
      .authenticate(req.body.email as string, req.body.pin as string);
  }

  @httpPost('/revoke', authenticate)
  private revoke(req: ICustomRequest): Promise<any> {
    return this.userCredentialService.getRefreshToken(req.body.refreshToken as string);
  }

  @httpPost('/password-recovery')
  private recoveryPin(req: ICustomRequest): Promise<any> {
    return this.userCredentialService.recoveryPin(req.body.email as string);
  }

  @httpPut('/password-recovery')
  private changePin(req: ICustomRequest): Promise<any> {
    return this.userCredentialService.changePin({
      email: req.body.email as string,
      recoveryToken: req.body.recoveryToken as string,
      pin: req.body.pin as string,
    });
  }

  @httpGet('/me', authenticate)
  private getMe(req: ICustomRequest): Promise<any> {
    return this.userCredentialService.getByUserId(req.user.id);
  }
}
