"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const request_routes_1 = __importDefault(require("./routes/request.routes"));
const errorMiddlewares_1 = require("../middlewares/errorMiddlewares");
const app = (0, express_1.default)();
const port = process.env.PORT || 80;
const allowedOrigins = ['*'];
const options = {
    origin: allowedOrigins
};
app.use((0, cors_1.default)(options));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/uploads", express_1.default.static("./uploads"));
app.use("/request", request_routes_1.default);
app.use(errorMiddlewares_1.errorHandler);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
