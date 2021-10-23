import { Request } from 'express';
import {
  httpGet,
  BaseHttpController,
  interfaces,
  controller,
} from 'inversify-express-utils';

import ViaCep from '../../mechanisms/viacep';

@controller('/util')
export class UtilController extends BaseHttpController implements interfaces.Controller {

  constructor(
  ) {
    super();
  }

  @httpGet('/cep')
  private getAddress(req: Request): Promise<any> {
    return ViaCep.getAddress(req.query.cep as string);
  }
}
