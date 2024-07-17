import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import requestRouter from "./routes/request.routes";
import { errorHandler } from "../middlewares/errorMiddlewares";

const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin ?? '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // This is the important part for handling credentials
};

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/uploads", express.static("./uploads"));
app.use("/request", requestRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
