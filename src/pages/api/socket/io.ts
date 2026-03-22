import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // Listen for events from any client and broadcast them to everyone else
      const events = [
        "product:new", 
        "product:update", 
        "product:delete", 
        "category:update", 
        "order:new", 
        "order:status", 
        "user:new"
      ];

      events.forEach((event) => {
        socket.on(event, (data) => {
          socket.broadcast.emit(event, data);
        });
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
