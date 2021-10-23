import { Container } from 'inversify';
import * as httpStatus from 'http-status';
import cors from 'cors';
import compress from 'compression';
import helmet from 'helmet';
import { v4 } from 'uuid';

import './controllers';

import { UserService } from './services/user';
import { IUserService } from './services/interfaces/user.interface';
import { UserRepository } from './db/repositories/user';
import { IUserRepository } from './db/repositories/interfaces/user';

import { UserCredentialService } from './services/user-credential';
import { IUserCredentialService } from './services/interfaces/user-credential.interface';
import { UserCredentialRepository } from './db/repositories/user-credential';
import { IUserCredentialRepository } from './db/repositories/interfaces/user-credential';

import { AccessTokenRepository } from './db/repositories/access-token';
import { IAccessTokenRepository } from './db/repositories/interfaces/access-token';

import { RefreshTokenRepository } from './db/repositories/refresh-token';
import { IRefreshTokenRepository } from './db/repositories/interfaces/refresh-token';

import TYPES from './utilities/types';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { NextFunction, Request, Response } from 'express';
import { ConstantsEnv } from './constants';
import LoggerManager from './utilities/logger-manager';

const container: Container = new Container();

const handleError: any = (err: any, req: Request, res: Response): void => {
  if (err.isBusinessError) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.code,
      options: err.options,
    });

  } else if (err.isUnauthorizedError) {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  } else if (err.isForbiddenError) {
    res.sendStatus(httpStatus.FORBIDDEN);
  } else {
    LoggerManager.log('application', {
      err,
      type: 'error',
      req: {
        requestId: req.headers['X-Request-ID'],
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        method: req.method,
        urlPath: req.path,
        urlQuery: req.query,
      },
    });

    if (ConstantsEnv.env !== 'production') {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        stack: err.stack, message: err.message, ...err,
      });
    } else {
      // LoggerManager.noticeError(err, {
      //   requestId: req.headers['X-Request-ID'] as string,
      //   originalUrl: req.originalUrl,
      //   baseUrl: req.baseUrl,
      //   method: req.method,
      //   urlPath: req.path,
      // });
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
};

export class Server {

  constructor() {
    this.configDependencies();
    this.createServer();
  }

  configDependencies(): void {
    container
      .bind<IUserService>(TYPES.UserService).to(UserService);
    container
      .bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

    container
      .bind<IUserCredentialService>(TYPES.UserCredentialService)
      .to(UserCredentialService);
    container
      .bind<IUserCredentialRepository>(TYPES.UserCredentialRepository)
      .to(UserCredentialRepository);

    container
      .bind<IAccessTokenRepository>(TYPES.AccessTokenRepository)
      .to(AccessTokenRepository);
    container
      .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
      .to(RefreshTokenRepository);

    container.bind(IProductRepository);
  }

  createServer(): void {
    const server: InversifyExpressServer = new InversifyExpressServer(container, null, { rootPath: '/api' });

    // tslint:disable-next-line: no-shadowed-variable
    server.setConfig((app: any): any => {
      // add body parser
      app.use(express.urlencoded({
        extended: true,
        limit: '10mb',
      }));
      app.use(express.json({
        limit: '10mb',
      }));

      app.disable('etag');

      app.use(compress());

      // secure apps by setting various HTTP headers
      app.use(helmet());

      // enable CORS - Cross Origin Resource Sharing
      app.use(cors());

      app.use((req: Request, _res: Response, next: NextFunction): void => {
        req.headers['X-Request-ID'] = v4();
        next();
      });
    });

    // tslint:disable-next-line: no-shadowed-variable
    server.setErrorConfig((app: any): void => {
      // catch 404 and forward to error handler
      app.use((_req: Request, res: Response): void => {
        res.status(httpStatus.NOT_FOUND).json();
      });

      // Handle 500
      // do not remove next from line bellow, error handle will not work
      app.use((
        err: any,
        req: Request,
        res: Response,
        next: NextFunction): void => handleError(err, req, res));
    });

    const app: any = server.build();

    app.listen(ConstantsEnv.port, (): void => console.log(`ONLINE ${ConstantsEnv.port}`));
  }
}
