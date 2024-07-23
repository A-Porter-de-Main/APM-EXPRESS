import express from "express";
import morgan from "morgan"
import cors from "cors";
import authRouter from "./routes/auth.routes";
import requestRouter from "./routes/request.routes";
import responseRouter from "./routes/response.routes";
import { errorHandler } from "../middlewares/errorMiddlewares";
import skillRouter from "./routes/skill.routes";

const app = express()
const port = process.env.PORT || 80;
const allowedOrigins = ['http://localhost:3000']; 

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options))
app.use(morgan("dev"));
app.use(express.json())
app.use("/auth", authRouter)

app.use("/uploads", express.static("./uploads"));

app.use("/auth", authRouter)
app.use("/request", requestRouter)
app.use("/response", responseRouter)
app.use("/skill", skillRouter)

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})  