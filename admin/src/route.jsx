import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import RestaurantAdd from "./pages/RestaurantAdd";
import MainLayout from "./components/MainLayout/MainLayout";
import Restaurant from "./pages/Restaurant";
import RestaurantDetails from "./pages/RestaurantDetails";
import CategoriesManage from "./pages/CategoriesManage";
import CategoryList from "./pages/CategoryList";
import CategoriesAdd from "./pages/CategoriesAdd";
import CategoriesLayout from "./pages/CategoriesLayout/CategoriesLayout";
import CategoriesUpdate from "./pages/CategoriesUpdate";
import RestaurantUpdate from "./pages/RestaurantUpdate";
import FoodAdd from "./pages/FoodAdd";
import RestaurantFoodUpdate from "./pages/RestaurantFoodUpdate";
import District from "./pages/District";
import DistrictAdd from "./pages/DistrictAdd";
import DistrictUpdate from "./pages/DistrictUpdate";
import Orders from "./pages/Orders";
import orderDetails from "./pages/orderDetails";
import OrderEdit from "./pages/OrderEdit";


const route = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { path: '/restaurant', Component: Restaurant },
            { path: '/add/restaurant', Component: RestaurantAdd },
            { path: '/restaurant/details', Component: RestaurantDetails },
            { path: '/restaurant/update', Component: RestaurantUpdate },
            {
                path: '/categories',
                Component: CategoriesLayout,
                children: [
                    { index: true, Component: CategoryList },
                    { path: '/categories/add', Component: CategoriesAdd },
                    { path: '/categories/update', Component: CategoriesUpdate },
                ]
            },
            { path: '/food/add', Component: FoodAdd },
            { path: '/restaurant/food/update', Component: RestaurantFoodUpdate },


            { path: '/orders', Component: Orders },

            { path: '/district', Component: District },
            { path: '/district/add', Component: DistrictAdd },
            { path: '/district/update', Component: DistrictUpdate },


            {path: '/order/details/:id', Component: orderDetails },
            {path: '/order/details/edit/:id', Component: OrderEdit}

        ]
    }

])


export default route