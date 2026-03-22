"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, [socket]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (!socket) return () => {};
    
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [socket]);

  useEffect(() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");

    if (!appUrl || typeof window === "undefined") return;

    let mounted = true;

    fetch("/api/socket/io")
      .catch(() => {})
      .finally(() => {
        if (!mounted) return;

        const socketInstance = ClientIO(appUrl, {
          path: "/api/socket/io",
          addTrailingSlash: false,
          transports: ["websocket", "polling"],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          if (mounted) setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
          if (mounted) setIsConnected(false);
        });

        socketInstance.on("connect_error", () => {
          if (mounted) setIsConnected(false);
        });

        setSocket(socketInstance);
      });

    return () => {
      mounted = false;
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit, on }}>
      {children}
    </SocketContext.Provider>
  );
};
