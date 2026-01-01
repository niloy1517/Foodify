import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import dbConnection from './config/db.js';
import { userAuthRoute } from './route/userAuth.route.js';
import { restaurantRoute } from './route/restaurant.route.js';
import { categoryRoute } from './route/categories.route.js';
import { foodRoute } from './route/food.route.js';
import { districtRoute } from './route/distirct.route.js';
import { userOrderRoute } from './route/userOrder.route.js';
import { userProfileRoute } from './route/userProfile.route.js';
import paymentRoute from './Payment/paymentRoutes.js'
import { query } from 'express-validator';
import { categoriesModel } from './models/categories.model.js';
import { restaurantModel } from './models/restaurant.model.js';
import { foodModel } from './models/food.model.js';



dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// const allowedOrigins = [
//     'http://localhost:5173',
//     'http://localhost:5174',
//     'http://localhost:5175'
// ]


// const corsOption = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true)

//         if (allowedOrigins.includes(origin)) {
//             callback(null, true)
//         } else {
//             callback(new Error("Not allowed by CORS"))
//         }
//     },
//     credentials: true
// }

// app.use(cors(corsOption))


const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(cookieParser())


//MONGODB CONNECTION
dbConnection()



//API ENDPOINT
app.use('/api/user', userAuthRoute)
app.use('/api/user/', userProfileRoute)
app.use('/api/restaurant', restaurantRoute)
app.use('/api/category', categoryRoute)
app.use('/api/food', foodRoute)
app.use('/api/district', districtRoute)
app.use('/api/user/order', userOrderRoute)
app.use('/images', express.static('uploads'))
app.use('/api/payment', paymentRoute)





app.get('/api/restaurant/search', async (req, res) => {
    const { categoryId, searchKeyword, sortBy, cuisine, rating, priceOrder, distance, lat, lng } = req.query;
console.log(req.query)
    try {
        // TOP RATED RESTAURANTS
        let topRatedRestaurants = [];

        if (sortBy === 'rating') {
            topRatedRestaurants = await restaurantModel.find().sort({ rating: -1 })
        }

        // FASTER DELIVERY RESTAURANTS
        let fasterDeliveryRestaurants = [];
        if (sortBy === 'delivery') {
            fasterDeliveryRestaurants = await restaurantModel.find()

            fasterDeliveryRestaurants.sort((a, b) => {
                let min = Number(a.deliveryTime.split('-')[0])
                let max = Number(b.deliveryTime.split('-')[1])
                return min - max
            })
        }


        //HIGH TO LOW PRICE RESTAURANTS
        let restaurantsHightToLowPrice = [];

        if (priceOrder) {
            const restaurants = await restaurantModel.find()
            const restaurantIds = restaurants.map(res => res._id)

            const foods = await foodModel.find({ restaurant: restaurantIds })

            const restaurantSorting = restaurants.map(restaurant => {

                const relatedFoods = foods.filter(food => food.restaurant.toString() === restaurant._id.toString())

                const prices = relatedFoods.map(rel => rel.price)

                const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;

                return { restaurant, avgPrice }
            })

            if(priceOrder === 'highToLow') {
                restaurantsHightToLowPrice = restaurantSorting.sort((a, b) => b.avgPrice - a.avgPrice).map(r => r.restaurant)
            } else {
                restaurantsHightToLowPrice = restaurantSorting.sort((a, b) => a.avgPrice - b.avgPrice).map(r => r.restaurant)
            }
        }


        // CATEGORY WISE RESTURANTS 
        const foods = await foodModel.find({
            "$or": [
                { foodName: { $regex: `${searchKeyword}`, $options: 'i' } },
                { category: categoryId }
            ]
        }).populate('restaurant')

        // GET ONLY RESTAURANT FROM FOODS
        const foodsRestaurants = foods.filter(food => food.restaurant).map(f => f.restaurant)

        // CUISINES AND RATING WISE RESTAURANTS
        const restaurants = await restaurantModel.find({
            "$or": [
                { cuisines: { $regex: `${cuisine}`, $options: 'i' } },
                { rating: { $gte: rating } },
            ]
        })

        const combineResults = [
            ...foodsRestaurants,
            ...restaurants,
            ...topRatedRestaurants,
            ...fasterDeliveryRestaurants,
            ...restaurantsHightToLowPrice
        ]


        const uniqueRestaurants = [];
        const seenIds = new Set();
        

        combineResults.forEach(res => {
            const restaurant = res; 
            if(!restaurant) return false

            if(!seenIds.has(restaurant._id)) {
                seenIds.add(restaurant._id)
                uniqueRestaurants.push(restaurant)
            }
        })
    
        
        // DISTANCE CALCULATION
        const distance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // KM
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;

            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        };

    
        const finalRestaurants = uniqueRestaurants.filter(restaurant => {
            
            if (!restaurant.location) return false

            const dist = distance(
                lat,
                lng,
                restaurant.location.coordinates[1],
                restaurant.location.coordinates[0]
            )

            return dist <= restaurant.deliveryRadius;
        })


        if (finalRestaurants.length === 0) {
            return res.json({ success: false, message: 'Restaurant not found' })
        }  

        res.json({ success: true, message: 'Restaurant found', data: finalRestaurants })
    } catch (error) {
        res.json({ success: false, message: 'Something went wrong' })
        console.log(error)
    }
})






app.get("/", (req, res) => {
    res.json("This is home route")
})


app.use((req, res) => {
    res.json("Route not found!")
})

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})