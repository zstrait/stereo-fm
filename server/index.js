const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

const MongoDatabaseManager = require('./db/mongodb');

let db;
db = new MongoDatabaseManager();
db.connect();

module.exports = { db };


app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors({
    origin: true, 
    credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())


const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)
const storeRouter = require('./routes/store-router')
app.use('/store', storeRouter)


if (require.main === module) {
    app.listen(PORT, () => console.log(`Playlister Server running on port ${PORT}`))
}
