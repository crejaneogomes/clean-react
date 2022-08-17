import { FieldValidationSpy } from '@/validation/test'
import { ValidationComposite } from './validation-composite'
import Faker from 'faker'

type SutType = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}
const makeSut = (fieldName: string): SutType => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]

  const sut = ValidationComposite.build(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = Faker.database.column()
    const { sut, fieldValidationsSpy } = makeSut(fieldName)
    const errorMessage = Faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMessage)
    fieldValidationsSpy[1].error = new Error(Faker.random.words())
    const error = sut.validate(fieldName, Faker.random.word())
    expect(error).toBe(errorMessage)
  })

  test('Should return falsy if there is no error', () => {
    const fieldName = Faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate(fieldName, Faker.random.word())
    expect(error).toBeFalsy()
  })
})
