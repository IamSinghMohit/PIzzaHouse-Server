import 'module-alias/register';
import dotenv from "dotenv";
import ValidateConfig from "./config";
dotenv.config();
ValidateConfig();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error-handler";
import routes from "./modules";
import http from "http";
import SocketInitilizer from "./socket";
import Logger from "./lib/logger";
import { applySpeedGooseCacheLayer } from "speedgoose";
import RedisClient from "./lib/redis";
import morgan from "morgan";
const PORT = process.env.PORT;

export const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL_CLIENT!,
            process.env.FRONTEND_URL_ADMIN!,
        ],
        credentials: true,
    }),
);

// morgan without logger
// app.use(morganMiddleware());
app.use(morgan("common"));
app.set("trust proxy", 1);

app.use((req, res, next) => {
    if (req.originalUrl === "/order/payment-result") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// PASSPORT
require("./lib/passport");
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

applySpeedGooseCacheLayer(mongoose, {
    redisOptions: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: parseInt(process.env.REDIS_PORT!),
    },
    defaultTtl: 100,
    debugConfig: {
        enabled: false,
    },
});
mongoose
    .connect(process.env.MONGODB_URL as string)
    .then(() => {
        if (!RedisClient) {
            new Error("Redis is not connected");
        }
        server.listen(PORT, () => Logger.info(`Listening on port ${PORT}`));

        process.on("SIGINT", () => {
            server.close(() => {
                Logger.info("server is closed");
            });
            mongoose.connection.close();
            process.exit(0);
        });
        process.on("SIGTERM", () => {
            server.close(() => {
                Logger.info("server is closed");
            });
            mongoose.connection.close();
            process.exit(0);
        });
    })
    .catch((e) => {
        Logger.error(e);
    });
