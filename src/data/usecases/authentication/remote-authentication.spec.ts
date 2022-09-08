import { HttpPostClientSpy } from '@/data/test'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { mockAccount, mockAuthentication } from '@/domain/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AuthenticationParams } from '@/domain/useCases'
import { AccountModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

type SutTypes = {
  stu: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const stu = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    stu,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct url', async () => {
    const url = faker.internet.url()
    const { stu, httpPostClientSpy } = makeSut(url)
    await stu.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpClient with correct body', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    const authenticationParams = mockAuthentication()
    await stu.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('Should throw InvalidCredentialsError when HttpPostClient returns 401', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = stu.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns 400', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = stu.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns 500', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = stu.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError when HttpPostClient returns 404', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = stu.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { stu, httpPostClientSpy } = makeSut()
    const accountModel = mockAccount()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: accountModel
    }
    const result = await stu.auth(mockAuthentication())
    expect(result).toBe(accountModel)
  })
})
