import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@/presentation/components'
import { BrowserRouter } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { MakeLogin } from './factories/pages/login/login-factory'

ReactDOM.render(
  <BrowserRouter>
    <Router makeLogin={<MakeLogin />}/>
  </BrowserRouter>,
  document.getElementById('main')
)
