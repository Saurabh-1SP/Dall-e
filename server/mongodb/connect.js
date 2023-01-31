import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.set('strictQuery', true);


    mongoose.connect(url)
    .then(() => console.log('fuck its connected'))
    .catch((err) => console.log('fuck'))
}

export default connectDB;