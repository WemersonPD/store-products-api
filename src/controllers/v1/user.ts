import { inject } from 'inversify';
import {
  httpGet,
  httpPut,
  httpPost,
  BaseHttpController,
  interfaces,
  controller,
  httpDelete,
} from 'inversify-express-utils';

import { IUserService } from '../../services/interfaces/user.interface';
import TYPES from '../../utilities/types';
import UserEntity from '../../db/entities/user';
import authorize from './../middleware/authorize';
import authenticate from './../middleware/authenticate';
import ProfileType from '../../enumerators/profile-type';
import { controllerPaginationHelper } from '../../utilities/utils';
import { Pagination, ISearchParameterUser } from '../../models/pagination';
import { ICustomRequest } from '../../models/custom-request';

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {

  constructor(
    @inject(TYPES.UserService)
    private userService: IUserService,
  ) {
    super();
  }

  @httpPost('/admin', authenticate, authorize([ProfileType.ADMIN]))
  private create(req: ICustomRequest): Promise<any> {
    return this.userService.create(
      req.body as UserEntity,
      req.user as UserEntity,
    );
  }

  @httpGet('/me', authenticate)
  private getMe(req: ICustomRequest): Promise<any> {
    return this.userService.getById(req.user.id);
  }

  @httpGet('/:id', authenticate, authorize([ProfileType.ADMIN]))
  private getById(req: ICustomRequest): Promise<any> {
    return this.userService.getById(req.params.id);
  }

  @httpGet('/', authenticate, authorize([ProfileType.ADMIN]))
  private getWithPagination(req: ICustomRequest): Promise<Pagination<UserEntity>> {
    const searchParameter: ISearchParameterUser = {
      ...req.query && req.query.name && {
        name: req.query.name.toString(),
      },
      ...req.query && req.query.email && {
        email: req.query.email.toString(),
      },
      ...req.query && req.query.profileType && {
        profileType: req.query.profileType.toString().split(','),
      },
      ...controllerPaginationHelper(req),
    };

    return this.userService.getWithPagination(searchParameter, req.user);
  }

  @httpPut('/:id', authenticate)
  private updateById(req: ICustomRequest): Promise<any> {
    return this.userService.updateById(req.params.id, req.body, req.user);
  }

  @httpDelete('/:id', authenticate, authorize([ProfileType.ADMIN]))
  private deleteById(req: ICustomRequest): Promise<any> {
    return this.userService.deleteById(req.params.id);
  }
}
