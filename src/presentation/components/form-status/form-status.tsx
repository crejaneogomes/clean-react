import React, { useContext } from 'react'
import Styles from './form-status-style.scss'
import { Spinner } from '@/presentation/components'
import Context from '@/presentation/components/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const FormStatus: React.FC<Props> = (props: Props) => {
  const { state } = useContext(Context)
  const isLoading = state.isLoading
  const mainError = state.mainError
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      { isLoading && <Spinner className={Styles.spinner}/> }
      { mainError && <span data-testid="main-error" className={Styles.error}>{mainError}</span> }
    </div>
  )
}

export default FormStatus
