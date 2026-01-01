import React from 'react'
import Root from './Root/Root'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
      <Root />
      <ToastContainer />
    </div>
  )
}

export default App