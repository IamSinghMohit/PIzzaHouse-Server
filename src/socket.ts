import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

function SocketInitilizer(httpServer: HTTPServer): Server {
    // const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.emit('hello',{},[])
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    return io;
}

export default SocketInitilizer;
