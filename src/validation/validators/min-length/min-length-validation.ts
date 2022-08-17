import { FieldValidation } from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/errors'

export class MinLengthValidation implements FieldValidation {
  constructor (readonly field, private readonly minLength: number) {}

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError()
  }
}
