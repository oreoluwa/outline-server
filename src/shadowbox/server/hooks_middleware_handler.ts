import * as restify from 'restify';
import {HooksMiddleware} from '../model/hooks';
import {HooksManager, requestHookMiddleware} from '../infrastructure/lifecycle_hooks';
// import * as logging from '../infrastructure/logging';

// Type to reflect that we receive untyped JSON request parameters.
interface RequestParams {
  // Supported parameters:
  //   id: string
  //   name: string
  //   metricsEnabled: boolean
  //   limit: DataUsage
  //   port: number
  //   hours: number
  [param: string]: unknown;
}
// Simplified request and response type interfaces containing only the
// properties we actually use, to make testing easier.
interface RequestType {
  params: RequestParams;
}
interface ResponseType {
  send(code: number, data?: {}): void;
}

export class HooksMiddlewareHandler implements HooksMiddleware {
  public key: string;
  private checkMark: string;
  constructor(
      private hooksManager: HooksManager
    ) {
      this.key = 'HooksMiddlewareHandler'
      this.checkMark = 'CoolCoolCool'
    }

  renameServer(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('RenameServer', this.hooksManager)(req, res, next);
  }

  getServer(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('GetServer', this.hooksManager)(req, res, next);
  }

  setPortForNewAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('SetPortForNewAccessKeys', this.hooksManager)(req, res, next);
  }

  setDataUsageTimeframe(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('SetDataUsageTimeframe', this.hooksManager)(req, res, next);
  }

  createNewAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('CreateAccessKey', this.hooksManager)(req, res, next);
  }

  listAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('ListAccessKeys', this.hooksManager)(req, res, next);
  }

  removeAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('RemoveAccessKey', this.hooksManager)(req, res, next);
  }

  renameAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('RenameAccessKey', this.hooksManager)(req, res, next);
  }

  setAccessKeyDataLimit(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('SetAccessKeyDataLimit', this.hooksManager)(req, res, next);
  }

  setHostnameForAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('SetHostnameForAccessKeys', this.hooksManager)(req, res, next);
  }

  removeAccessKeyDataLimit(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('RemoveAccessKeyDataLimit', this.hooksManager)(req, res, next);
  }

  getDataUsage(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('GetDataUsage', this.hooksManager)(req, res, next);
  }

  getShareMetrics(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('GetShareMetrics', this.hooksManager)(req, res, next);
  }

  setShareMetrics(req: RequestType, res: ResponseType, next: restify.Next): void {
    return requestHookMiddleware('SetShareMetrics', this.hooksManager)(req, res, next);
  }
}
