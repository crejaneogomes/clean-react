import React, { useContext } from 'react'
import Styles from './input-style.scss'
import Context from '@/presentation/components/contexts/form/form-context'

type Props = {
  name: string
  placeholder: string
  type: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = (props: Props) => {
  const { state } = useContext(Context)
  const error = state[`${props.name}Error`]
  const enableInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }

  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  return (
    <div className={Styles.inputWrap}>
      <input data-testid={props.name} {...props} readOnly onFocus={enableInput}/>
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
