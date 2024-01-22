import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { EventEmitter } from "./eventEmitter";

function SocketInitilizer(httpServer: HTTPServer): Server {
    // const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:3000"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        });
    });
    EventEmitter.on("update_status", ({ roomId, data }) => {
        io.to(roomId).emit("status_updated", data);
    });
    return io;
}

export default SocketInitilizer;
