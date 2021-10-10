require('dotenv').config()
module.exports = {
    secret: process.env.DB_SECRET,
    database: process.env.DB_URI
}