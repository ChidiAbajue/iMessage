import express from "express"
import "dotenv/config"
console.log(process.env.DB_URL)

const app = express()

app.listen(3000, console.log('Server is up and running on Port ', process.env.PORT))