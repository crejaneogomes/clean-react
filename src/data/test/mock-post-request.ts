import { HttpPostClientParams } from '@/data/protocols/http'
import { faker } from '@faker-js/faker'

export const mockPostRequest = (): HttpPostClientParams<any> => {
  return {
    url: faker.internet.url(),
    body: faker.helpers.objectValue({ myProperty: 'myValue' })
  }
}
