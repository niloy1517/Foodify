import mongoose from 'mongoose'


const dbConnection = async () => {
    const URL = process.env.MONOGODB_URL;
    try {
        if(!URL) {
            console.log('Mongodb connection string not found!')
        }
        
        await mongoose.connect(URL);
        console.log("DB Connection successful")
    } catch (error) {
        console.log("DB Connection failed", error)
    }
}

export default dbConnection