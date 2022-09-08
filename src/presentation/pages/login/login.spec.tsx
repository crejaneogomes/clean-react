import React from 'react'
import { faker } from '@faker-js/faker'
import { MemoryRouter as Router } from 'react-router-dom'
import { cleanup, fireEvent, getByTestId, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import 'jest-localstorage-mock'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router initialEntries={['/login']}>
      <Login validation={ validationStub } authentication={ authenticationSpy } />
    </Router>
  )
  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = (
  sut: RenderResult,
  email: string = faker.internet.email(),
  password: string = faker.internet.password()
): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
}

const populateEmailField = (sut: RenderResult,
  email: string = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult,
  password: string = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = async (sut: RenderResult,
  fieldName: string,
  validationError?: string
): Promise<void> => {
  const status = sut.getByTestId(`${fieldName}-status`)
  await waitFor(() => {
    expect(status.title).toBe(validationError || 'Tudo certo!')
    expect(status.textContent).toBe(validationError ? '🔴' : '🟢')
  })
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const field = sut.getByTestId(fieldName)
  expect(field).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, message: string): void => {
  const field = sut.getByTestId(fieldName)
  expect(field.textContent).toBe(message)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Page', () => {
  afterEach(cleanup)
  beforeEach(() => { localStorage.clear() })

  test('Should start with initial state', async () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testErrorWrapChildCount(sut, 0)
    testButtonIsDisabled(sut, 'submit', true)
    await testStatusForField(sut, 'email', validationError)
    await testStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if validation fales', async () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    await testStatusForField(sut, 'email', validationError)
  })

  test('Should show email error if validation fales', async () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    await testStatusForField(sut, 'password', validationError)
  })

  test('Should show valid password if validation is succeds', async () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    await testStatusForField(sut, 'password')
  })

  test('Should show valid email if validation is succeds', async () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    await testStatusForField(sut, 'email')
  })

  test('Should enable submit button if forms is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => {
      testElementExists(sut, 'spinner')
    })
  })

  test('Should call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password)
    await waitFor(() => {
      expect(authenticationSpy.params).toStrictEqual({ email, password })
    })
  })

  test('Should call authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => {
      simulateValidSubmit(sut)
      expect(authenticationSpy.callsCount).toBe(1)
    })
  })

  test('Should not call authentication if from is invlid', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    simulateValidSubmit(sut)
    await waitFor(() => {
      expect(authenticationSpy.callsCount).toBe(0)
    })
  })

  test('Should present error if authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(sut)
    await waitFor(() => {
      testElementText(sut, 'main-error', error.message)
      testErrorWrapChildCount(sut, 1)
    })
  })

  test('Should add access token to local storage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.resolve(authenticationSpy.accountModel))
    simulateValidSubmit(sut)
    await waitFor(() => {
      const errorWrap = sut.getByTestId('error-wrap')
      expect(errorWrap.childElementCount).toBe(0)
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.accountModel.accessToken)
    })
  })
})
