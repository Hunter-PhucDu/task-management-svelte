import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import type { TypedServer, TypedSocket } from './events';
import { registerUserHandlers } from './handlers/userHandler';
import { registerTaskHandlers } from './handlers/taskHandler';
import { SocketUserStore } from '../stores/userStore';

export function createSocketServer(server: ViteDevServer) {
  const io: TypedServer = new Server(server.httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const userStore = new SocketUserStore();

  io.on('connection', (socket: TypedSocket) => {
    console.log(`New connection established: ${socket.id}`);
    
    registerUserHandlers(io, socket, userStore);
    registerTaskHandlers(io, socket);
  });

  return io;
}

export function socketIOPlugin() {
  let io: TypedServer;

  return {
    name: 'vite-socket-io-plugin',
    configureServer(server: ViteDevServer) {
      io = createSocketServer(server);
    }
  };
}
