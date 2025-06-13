import express from "express"
const app = express()


app.use(express.json())




// impored routes
import userRouter from "./routes/user.routes.js"



// routes
app.use("/api/v1/users", userRouter)


export default app