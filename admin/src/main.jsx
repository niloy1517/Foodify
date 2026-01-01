import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import route from './route.jsx'
import RestaurantContext from './Context/RestaurantContext.jsx'
import { persistor, store } from './Services/Redux/Store.js'
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
              <RestaurantContext>
        <ToastContainer></ToastContainer>
        <RouterProvider router={route}>
            <App />
        </RouterProvider>
      </RestaurantContext>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
