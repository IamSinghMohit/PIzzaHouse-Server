import 'module-alias/register';
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error-handler";
import routes from "./modules";
import morgan from "morgan";
import http from "http";
import SocketInitilizer from "./socket";
const PORT = process.env.PORT;

export const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    }),
);

app.use(morgan("common"));
app.use((req, res, next) => {
    if (req.originalUrl === "/order/payment-result") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// PASSPORT
require("./passport");
app.use(passport.initialize());
// ------------------------->
// Settings up Queues
require("./queue");
// -------------------->

// HEALTH CHECK
app.get("/", (req, res) => {
    res.json({ message: "api is healthy" });
});

// Routes
app.use(routes);

// ********* Global Error handler *********
app.use(errorHandler);

// initilizing socket.io and creating server
const server = http.createServer(app);
SocketInitilizer(server);

mongoose
    .connect(process.env.MONGODB_URL as string)
    .then(() => {
        server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    })
    .catch((e) => {
        console.log(e);
    });
