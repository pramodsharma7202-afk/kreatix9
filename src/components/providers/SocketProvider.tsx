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

function getSocketUrl() {
  if (typeof window === "undefined") return "";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return window.location.origin;
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (!isClient) return;

    const appUrl = getSocketUrl();
    if (!appUrl) return;

    let mounted = true;
    let socketInstance: Socket | null = null;

    const connectSocket = () => {
      if (!mounted) return;

      try {
        socketInstance = ClientIO(appUrl, {
          path: "/api/socket/io",
          addTrailingSlash: false,
          transports: ["websocket", "polling"],
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        socketInstance.on("connect", () => {
          if (mounted) {
            setIsConnected(true);
            console.log("Socket connected:", socketInstance?.id);
          }
        });

        socketInstance.on("disconnect", () => {
          if (mounted) {
            setIsConnected(false);
            console.log("Socket disconnected");
          }
        });

        socketInstance.on("connect_error", (error) => {
          if (mounted) {
            setIsConnected(false);
            console.log("Socket connection error (may be expected on serverless platforms)");
          }
        });

        setSocket(socketInstance);
      } catch (error) {
        console.log("Socket initialization error (may be expected on serverless platforms)");
      }
    };

    connectSocket();

    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit, on }}>
      {children}
    </SocketContext.Provider>
  );
};
