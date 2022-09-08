import { Authentication, AuthenticationParams } from '@/domain/useCases'
import { mockAccount } from '@/domain/test'
import { AccountModel } from '@/domain/models'

export class AuthenticationSpy implements Authentication {
  accountModel: AccountModel = mockAccount()
  params: AuthenticationParams
  callsCount = 0
  async auth (params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    this.callsCount++
    return await Promise.resolve(this.accountModel)
  }
}
