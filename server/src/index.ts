import express from "express"
import mongoose from "mongoose"

import { PORT, DB_URI } from "./const"
import { authRouter } from "./routes/auth"

// tslint:disable-next-line:no-console
const app = express()

// middleware
app.use(express.json())
app.use(authRouter)

// connections
mongoose
	.connect(DB_URI)
	.then(() => {
		// tslint:disable-next-line:no-console
		console.log("Connected to database")
	}).catch((e) => {
		// tslint:disable-next-line:no-console
		console.log(e)
	})

// use "0.0.0.0" for Android emulator to communicate with server
app.listen(PORT, "0.0.0.0", () => {
	// tslint:disable-next-line:no-console
	console.log(`Connected at port ${PORT}`)
})