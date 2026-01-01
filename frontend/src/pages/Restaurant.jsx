import RestaurantTopSection from './RestaurantTopSection'
import RestaurantFoodList from './RestaurantFoodList'
import AddToCartBox from './AddToCartBox'
import MobileCartPopup from './MobileCartPopup'
import { useSelector } from 'react-redux'

const Restaurant = () => {

  const carts = useSelector((state) => state.cart.carts);

  const restaurantId = useSelector((state) => state.restaurant.restaurantId);
  const userData = useSelector((state) => state.user.userData);

  const userId = userData?._id || "guest";


  const userCart = carts?.[userId] || {};
  const restaurantCart = userCart?.[restaurantId] || {};
  const items = restaurantCart?.items || [];

  return (
    <div>
      <RestaurantTopSection />
      <div>
        <div className='flex gap-10 px-4 justify-between'>
          <RestaurantFoodList />
          <AddToCartBox />
        </div>
        {
          items.length > 0 && <MobileCartPopup />
        }
      </div>
    </div>
  )
}

export default Restaurant


