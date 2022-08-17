import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Styles from './login-style.scss'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/components/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/useCases'

type Props = {
  validation?: Validation
  authentication?: Authentication
}
const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    })
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return
      }
      setState({ ...state, isLoading: true })

      const result = await authentication.auth({
        email: state.email,
        password: state.password
      })
      localStorage.setItem('accessToken', result.accessToken)
      setState({
        ...state,
        isLoading: false
      })
      navigate('../', { replace: true })
    } catch (error) {
      setState({
        ...state,
        mainError: error.message,
        isLoading: false
      })
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form data-testid="form"className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input onChange={handleChange} type="email" name="email" placeholder="Digite seu e-mail" />
          <Input onChange={handleChange} type="password" name="password" placeholder="Digite sua senha"/>
          <button data-testid="submit" disabled={!!state.emailError || !!state.passwordError} className={Styles.submit} type="submit">Entrar</button>
          <Link to="/signup" data-testid="signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}

export default Login
