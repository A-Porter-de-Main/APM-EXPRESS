import express from "express";
import morgan from "morgan"
import cors from "cors";
import authRouter from "./routes/auth.routes";
import requestRouter from "./routes/request.routes";
import responseRouter from "./routes/response.routes";
import {errorHandler} from "../middlewares/errorMiddlewares";
import skillRouter from "./routes/skill.routes";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";
import {pusher} from "../utils/pusher";

import {createServer} from 'http';
import {Server as SocketIOServer} from 'socket.io';

const app = express()
const port = process.env.PORT || 80;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001',];

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


if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;


//Mon serveur socket
const app2 = express();
const httpServer = createServer(app2);
export const io = new SocketIOServer(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (chatId) => {
        socket.join(`${chatId}`);
        console.log(`User joined ${chatId}`);
    });

    socket.on('sendMessage', (data) => {
        io.to(`chat_${data.chatId}`).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const socketPort = 84;
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(socketPort, () => {
        console.log(`Server running on http://localhost:${socketPort}`);
    });
}