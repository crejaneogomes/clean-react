import { FieldValidation } from '@/validation/protocols/field-validation'
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'

export class ValidationBuilder {
  private constructor (private readonly fieldName: string, private readonly validators: FieldValidation[]) {}

  static field (fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, [])
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredFieldValidation(this.fieldName))
    return this
  }

  email (): ValidationBuilder {
    this.validators.push(new EmailValidation(this.fieldName))
    return this
  }

  min (minLenght: number): ValidationBuilder {
    this.validators.push(new MinLengthValidation(this.fieldName, minLenght))
    return this
  }

  build (): FieldValidation[] {
    return this.validators
  }
}
