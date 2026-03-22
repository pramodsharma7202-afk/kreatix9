import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  (global as any).httpServer = httpServer;
  (global as any).io = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:admin', () => {
      socket.join('admin');
    });

    socket.on('join:user', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('order:new', (data: any) => {
      io.to('admin').emit('order:new', data);
    });

    socket.on('order:status', (data: any) => {
      io.to('admin').emit('order:status', data);
      if (data.userId) {
        io.to(`user:${data.userId}`).emit('order:status', data);
      }
    });

    socket.on('product:new', (data: any) => {
      io.to('admin').emit('product:new', data);
    });

    socket.on('product:update', (data: any) => {
      io.to('admin').emit('product:update', data);
    });

    socket.on('product:delete', (data: any) => {
      io.to('admin').emit('product:delete', data);
    });

    socket.on('category:new', (data: any) => {
      io.to('admin').emit('category:new', data);
    });

    socket.on('category:update', (data: any) => {
      io.to('admin').emit('category:update', data);
    });

    socket.on('category:delete', (data: any) => {
      io.to('admin').emit('category:delete', data);
    });

    socket.on('user:new', (data: any) => {
      io.to('admin').emit('user:new', data);
    });

    socket.on('notification:admin', (data: any) => {
      io.to('admin').emit('notification:admin', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
