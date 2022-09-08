import { AuthenticationParams } from '@/domain/useCases'
import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models'

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccount = (): AccountModel => ({
  accessToken: faker.datatype.uuid()
})
