const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv')
const  mongoose  = require('mongoose')
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser : true})
.then(()=> console.log('connected to db'))
.catch((error) => console.log(error))


//routes
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')

//middleware
app.use(express.json())

//route middleware
app.use('/api/user' , authRoutes)
app.use('/api/posts' , postRoutes)





app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))