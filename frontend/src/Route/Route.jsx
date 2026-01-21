import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../MainLayout/MainLayout'
import App from '../App'
import Profile from '../pages/Profile'
import Restaurant from '../pages/Restaurant'
import DistrictRestaurantList from '../pages/DistrictRestaurantList'
import OrderList from '../pages/OrderList'
import MainPage from '../pages/MainPage/MainPage'
import PaymentSuccessfull from '../pages/PaymentSuccessfull'
import PaymentFailed from '../pages/PaymentFailed'
import viewMobileCartDetails from '../pages/viewMobileCartDetails'
import Checkout from '../pages/Checkout'



const route = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { index: true, Component: App },
            { path: '/profile', Component: Profile },
            { path: '/restaurant/:name', Component: Restaurant },
            { path: '/restaurants/district', Component: DistrictRestaurantList },
            { path: '/checkout', Component: Checkout },
            { path: '/order', Component: OrderList },
            { path: `/restaurants/new`, Component: MainPage },
            { path: `/payment-success/:id`, Component: PaymentSuccessfull },
            { path: '/payment-failed/:id', Component: PaymentFailed },
        ]
    },

    { path: '/restaurant/:name/cart', Component: viewMobileCartDetails }

])


export default route

