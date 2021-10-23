import { Request } from 'express';
import { DateTime, Interval } from 'luxon';
import { ConstantsEnv } from '../../constants';
import {
  httpGet,
  BaseHttpController,
  interfaces,
  controller,
} from 'inversify-express-utils';

const startedAt: any = DateTime.local();

@controller('/health')
export class HealthController extends BaseHttpController implements interfaces.Controller {
  startedAt: number;
  constructor() {
    super();
    this.startedAt = Date.now();
  }

  @httpGet('/status')
  private getStatus(req: Request): { app: string, uptime: number, now: string } {
    return {
      app: ConstantsEnv.appName,
      uptime: Interval.fromDateTimes(startedAt, DateTime.local()).length('seconds'),
      now: DateTime.local().toISO(),
    };
  }
}
