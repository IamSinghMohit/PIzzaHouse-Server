import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { EventEmitter } from "./eventEmitter";

function SocketInitilizer(httpServer: HTTPServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL_CLIENT!,
                process.env.FRONTEND_URL_ADMIN!,
            ],
        },
    });

    io.on("connection", (socket) => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        });
        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
        });
    });
    EventEmitter.on("update_status", ({ roomId, data }) => {
        io.to(roomId).emit("status_updated", data);
    });
    return io;
}

export default SocketInitilizer;
