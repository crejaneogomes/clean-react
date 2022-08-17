import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from './email-validation'
import Faker from 'faker'

const makeSut = (): EmailValidation => new EmailValidation(Faker.random.words())

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(Faker.random.words())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(Faker.internet.email())
    expect(error).toBeFalsy()
  })

  test('Should return falsy if email is empty', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toBeFalsy()
  })
})
