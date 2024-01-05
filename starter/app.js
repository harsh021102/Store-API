require('dotenv').config()
// async errors
require('express-async-errors')


const express = require('express')
const app = express();

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json()) //not used in this project, juts using so that we dont forget the syntax


//routes

app.get('/',(req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})
app.use('/api/v1/products', productRouter)


//product route

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT||3000

const start = async () =>{
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`server is listening at port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start()