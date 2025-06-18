import { Server, Socket } from 'socket.io';
import type { Task } from '../models/task';

export interface ClientToServerEvents {
  user_join: (username: string) => void;
  
  get_all_tasks: () => void;
  create_task: (taskData: Partial<Task>) => void;
  update_task: (data: { taskId: string; updates: Partial<Task> }) => void;
  delete_task: (taskId: string) => void;
  get_task: (taskId: string) => void;
}

export interface ServerToClientEvents {
  welcome: (message: string) => void;

  user_joined: (username: string) => void;
  user_left: (username: string) => void;
  users_online: (userList: string[]) => void;
  
  tasks_update: (tasks: Task[]) => void;
  task_created: (task: Task) => void;
  task_updated: (task: Task) => void;
  task_deleted: (taskId: string) => void;
  task_details: (task: Task) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username?: string;
  userId?: string;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface UserStore {
  get(socketId: string): string | undefined;
  set(socketId: string, username: string): void;
  delete(socketId: string): boolean;
  values(): IterableIterator<string>;
  size: number;
}
