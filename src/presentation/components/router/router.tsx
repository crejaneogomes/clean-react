import React, { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'

type Props = {
  makeLogin: React.ReactNode
}

const Router: React.FC<Props> = ({ makeLogin }: Props) => {
  return (
    <Routes>
      <Route
        path="/login"
        element = {makeLogin}
      />
    </Routes>
  )
}

export default Router
