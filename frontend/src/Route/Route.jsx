import { createBrowserRouter, useLocation } from 'react-router-dom'

import MainLayout from '../MainLayout/MainLayout'
import App from '../App'
import EditProfile from '../Profile/EditProfile'
import Profile from '../pages/Profile'
import Restaurant from '../pages/Restaurant'
import DistrictRestaurantList from '../pages/DistrictRestaurantList'
import OrderList from '../pages/OrderList'
import Payment from '../pages/Payment'
import MainPage from '../pages/MainPage/MainPage'
import Checkout from '../pages/checkout'
import PaymentSuccessfull from '../pages/PaymentSuccessfull'
import PaymentFailed from '../pages/PaymentFailed'
import RestaurantFindByCategory from '../pages/RestaurantFindByCategory'
import viewMobileCartDetails from '../pages/viewMobileCartDetails'

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
            { path: '/payment', Component: Payment },
            { path: '/restaurants', Component: MainPage },
            { path: `/payment-success/:id`, Component: PaymentSuccessfull },
            { path: '/payment-failed/:id', Component: PaymentFailed },
            { path: '/category/restaurant/:id', Component: RestaurantFindByCategory },
        ]
    },

    { path: '/restaurant/:name/cart', Component: viewMobileCartDetails }

])


export default route

