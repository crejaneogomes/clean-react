import { HttpResponse } from '@/data/protocols/http'

export type HttpPostClientParams<T> = {
  url: string
  body?: T
}

export interface HttpPostClient<T, R> {
  post(url: HttpPostClientParams<T>): Promise<HttpResponse<R>>
}
