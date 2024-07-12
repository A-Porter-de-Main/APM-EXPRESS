import express from "express";
// import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes.";
import { errorHandler } from "../middlewares/errorMiddlewares";
const app = express()
const port = process.env.PORT || 80;

app.use(express.json())
app.use("/auth", authRouter)

app.use("/uploads", express.static("./uploads"));

app.use(errorHandler)



app.listen(port, () =>{
  console.log(`Server running on http://localhost:${port}`)
})  