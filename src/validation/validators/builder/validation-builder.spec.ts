import { ValidationBuilder as sut } from './validation-builder'
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'
import Faker from 'faker'

describe('ValidationBuilder', () => {
  test('Should return requiredFieldValidation', () => {
    const fieldName = Faker.database.column()
    const validators = sut.field(fieldName).required().build()
    expect(validators).toEqual([new RequiredFieldValidation(fieldName)])
  })

  test('Should return EmailValidation', () => {
    const fieldName = Faker.database.column()
    const validators = sut.field(fieldName).email().build()
    expect(validators).toEqual([new EmailValidation(fieldName)])
  })

  test('Should return MinLengthValidation', () => {
    const fieldName = Faker.database.column()
    const minLength = Faker.random.number()
    const validators = sut.field(fieldName).min(minLength).build()
    expect(validators).toEqual([new MinLengthValidation(fieldName, minLength)])
  })

  test('Should return a list of validations', () => {
    const fieldName = Faker.database.column()
    const minLength = Faker.random.number()
    const validators = sut.field(fieldName).required().email().min(minLength).build()
    expect(validators).toEqual([
      new RequiredFieldValidation(fieldName),
      new EmailValidation(fieldName),
      new MinLengthValidation(fieldName, minLength)
    ])
  })
})
