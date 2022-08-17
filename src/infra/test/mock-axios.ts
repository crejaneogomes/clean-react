import axios from 'axios'
import faker from 'faker'

export const mockHttpResponse = (): any => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue(mockHttpResponse())

  return mockedAxios
}
