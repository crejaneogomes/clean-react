import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'
import Faker from 'faker'

const makeSut = (): MinLengthValidation => new MinLengthValidation(Faker.random.words(), 5)

describe('EmailValidation', () => {
  test('Should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(Faker.random.alphaNumeric(3))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(Faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})
