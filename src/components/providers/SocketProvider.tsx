"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine the correct app URL dynamically to avoid CORS issues on Vercel
    // Use env variable if set, otherwise fall back to the current origin in the browser
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    // Skip socket init if we can't determine a URL
    if (!appUrl) return;

    // Initial fetch to make sure the socket io server is initialized
    fetch("/api/socket/io").finally(() => {
      const socketInstance = ClientIO(appUrl, {
        path: "/api/socket/io",
        addTrailingSlash: false,
        // Prefer WebSocket upgrade, fallback to polling
        transports: ["websocket", "polling"],
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      socketInstance.on("connect_error", () => {
        // Silently handle connection errors in production
        setIsConnected(false);
      });

      setSocket(socketInstance);
    });

    return () => {
      socket?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
