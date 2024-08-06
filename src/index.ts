import express from "express";
import morgan from "morgan"
import cors from "cors";
import authRouter from "./routes/auth.routes";
import requestRouter from "./routes/request.routes";
import responseRouter from "./routes/response.routes";
import { errorHandler } from "../middlewares/errorMiddlewares";
import skillRouter from "./routes/skill.routes";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";
import { pusher } from "../utils/pusher";

const app = express()
const port = process.env.PORT || 80;
const allowedOrigins = ['http://localhost:3000','http://localhost:3001', ];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
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
app.use("/chat", chatRouter)
app.use("/message", messageRouter)

app.use(errorHandler)

// ...app.use statements

// app.post("/pusher/auth", (req, res) => {
//     const socketId = req.body.socket_id;
//     const channel = req.body.channel_name;
//     const username = "admin";


//     const authResponse = pusher.authorizeChannel(socketId, channel);
//     res.json({
//         ...authResponse,
//         //   channel_data: JSON.stringify(user),
//     });
// });



// ...rest of code



const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})

module.exports = server;