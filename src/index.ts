import express from "express";
import morgan from "morgan"
import authRouter from "./routes/auth.routes";
import requestRouter from "./routes/request.routes";
import { errorHandler } from "../middlewares/errorMiddlewares";

const app = express()
const port = process.env.PORT || 80;

app.use(morgan("dev"));
app.use(express.json())
app.use("/uploads", express.static("./uploads"));

app.use("/auth", authRouter)
app.use("/request", requestRouter)

app.use(errorHandler)


app.listen(port, () =>{
  console.log(`Server running on http://localhost:${port}`)
})  