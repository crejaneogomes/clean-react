import React from 'react'
import Styles from './spinner-style.scss'

type Props = {
  className: string
}

const Spinner: React.FC<React.HTMLAttributes<HTMLElement>> = (props: Props) => {
  return (
    <div {...props} data-testid="spinner" className={[Styles.spinner, props.className].join(' ')}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

export default Spinner
