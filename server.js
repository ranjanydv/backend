require('dotenv').config()
require('express-async-errors')

// Express
const express = require('express')
const app = express()

// cors
const cors = require('cors')

// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bidRouter = require('./routes/bidRoutes')
const eventRouter = require('./routes/eventRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const corsOptions = {
    origin: '*',
}

// invoking imports
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors(corsOptions))

app.use(express.static('./public'))
app.use(fileUpload({limits: {fileSize: 2 * 1024 * 1024}}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies)
    res.send('Hello World!')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bids', bidRouter)
app.use('/api/v1/events', eventRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Premiere Auctioneers server listening on port http://localhost:${port}`)
        })
    } catch (error) {
        console.error(error)
    }
}

start().catch((error) => console.error(error))
