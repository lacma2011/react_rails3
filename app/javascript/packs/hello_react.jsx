import React from 'react'
import ReactDOM from 'react-dom'

import Counter from '../components/Counter';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Counter/>,
    document.body.appendChild(document.createElement('div')),
  )
})
