"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const request_routes_1 = __importDefault(require("./routes/request.routes"));
const response_routes_1 = __importDefault(require("./routes/response.routes"));
const errorMiddlewares_1 = require("../middlewares/errorMiddlewares");
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = process.env.PORT || 80;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001',];
const options = {
    origin: allowedOrigins,
    credentials: true,
};
app.use((0, cors_1.default)(options));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/uploads", express_1.default.static("./uploads"));
app.use("/auth", auth_routes_1.default);
app.use("/request", request_routes_1.default);
app.use("/response", response_routes_1.default);
app.use("/skill", skill_routes_1.default);
app.use("/chat", chat_routes_1.default);
app.use("/message", message_routes_1.default);
app.use(errorMiddlewares_1.errorHandler);
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
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//Mon serveur socket
const app2 = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app2);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});
exports.io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', (chatId) => {
        socket.join(`${chatId}`);
        console.log(`User joined ${chatId}`);
    });
    socket.on('sendMessage', (data) => {
        exports.io.to(`chat_${data.chatId}`).emit('newMessage', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const socketPort = 84;
httpServer.listen(socketPort, () => {
    console.log(`Server running on http://localhost:${socketPort}`);
});
