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
import './cron/autoCancelPendingOrders.js'


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




app.get("/", (req, res) => {
    res.json("This is home route")
})


app.use((req, res) => {
    res.json("Route not found!")
})

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})