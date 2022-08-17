export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  unauthorized = 401,
  badRequest = 400,
  serverError = 500,
  notFound = 404,
}

export type HttpResponse<R> = {
  statusCode: HttpStatusCode
  body?: R
}
