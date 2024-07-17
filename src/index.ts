import express from "express";
import cors from "cors";
// import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import {errorHandler} from "../middlewares/errorMiddlewares";

const app = express()
const port = process.env.PORT || 80;
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options))
app.use(express.json())
app.use("/auth", authRouter)

app.use("/uploads", express.static("./uploads"));

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})  