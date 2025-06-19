import type { TypedServer, TypedSocket } from '../events';
import type { SocketUserStore } from '../../stores/userStore';
import type { User } from '../../models/user';

const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: 'admin123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export function registerUserHandlers(io: TypedServer, socket: TypedSocket, userStore: SocketUserStore) {
  const handleUserJoin = (username: string) => {

    const user = users.find(u => u.username === username);
    
    userStore.set(socket.id, username);
    socket.data.username = username;
    socket.data.userId = user?.id || 'guest';
    
    socket.emit('welcome', `Welcome ${username} to the task management system!`);
    
    socket.broadcast.emit('user_joined', username);
    
    io.emit('users_online', userStore.getAllUsers());
    
    console.log(`${username} joined task management system (${socket.id})`);
  };

  const handleDisconnect = () => {
    const username = userStore.get(socket.id);
    if (username) {
      userStore.delete(socket.id);
      
      io.emit('user_left', username);

      io.emit('users_online', userStore.getAllUsers());
      
      console.log(`${username} left task management system (${socket.id})`);
    }
  };

  socket.on('user_join', handleUserJoin);
  socket.on('disconnect', handleDisconnect);
}
