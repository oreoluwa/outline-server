import * as restify from 'restify';

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

export interface HooksMiddleware {
  renameServer(req: RequestType, res: ResponseType, next: restify.Next): void

  getServer(req: RequestType, res: ResponseType, next: restify.Next): void
  // Changes the port for new access keys.
  setPortForNewAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void
  // Sets the data usage timeframe for access key data limit enforcement. Throws on failure.
  setDataUsageTimeframe(req: RequestType, res: ResponseType, next: restify.Next): void
  // Creates a new access key. Parameters are chosen automatically.
  createNewAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void
  // Lists all existing access keys
  listAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void
  // Removes the access key given its id. Throws on failure.
  removeAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void
  // Apply the specified update to the specified access key. Throws on failure.
  renameAccessKey(req: RequestType, res: ResponseType, next: restify.Next): void
  // Sets the transfer limit for the specified access key. Throws on failure.
  setAccessKeyDataLimit(req: RequestType, res: ResponseType, next: restify.Next): void
  // Sets hostname for access keys. Throws on failure.
  setHostnameForAccessKeys(req: RequestType, res: ResponseType, next: restify.Next): void
  // Clears the transfer limit for the specified access key. Throws on failure.
  removeAccessKeyDataLimit(req: RequestType, res: ResponseType, next: restify.Next): void
  // Gets the metrics of usage
  getDataUsage(req: RequestType, res: ResponseType, next: restify.Next): void
  // Gets the share metrics
  getShareMetrics(req: RequestType, res: ResponseType, next: restify.Next): void
  // Sets the share metrics
  setShareMetrics(req: RequestType, res: ResponseType, next: restify.Next): void
}
