import React from 'react'
import Faker from 'faker'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/components/contexts/form/form-context'

const makeSut = (inputName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={inputName} placeholder="field" type="email" />
    </Context.Provider>
  )
}
describe('InputComponent', () => {
  test('Should begin with readonly', () => {
    const inputName = Faker.database.column()
    const sut = makeSut(inputName)
    const input = sut.getByTestId(inputName) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('Should remove readonly on focus', () => {
    const inputName = Faker.database.column()
    const sut = makeSut(inputName)
    const input = sut.getByTestId(inputName) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })
})
