import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { Task } from '../models/task';

type SocketState = {
    connected: boolean;
    usersOnline: string[];
}

const createSocketStore = () => {
    const { subscribe, update, set } = writable<SocketState>({
        connected: false,
        usersOnline: []
    });
    
    let socket;
    let initialized = false;
    
    return {
        subscribe,
        
        connect: (username: string) => {
            if (!socket) {
                socket = io();
                
                socket.on('connect', () => {
                    update(state => ({ ...state, connected: true }));
                    console.log('Socket connected');
                    
                    if (username && !initialized) {
                        socket.emit('user_join', username);
                        initialized = true;
                    }
                });
                
                socket.on('disconnect', () => {
                    update(state => ({ ...state, connected: false }));
                    console.log('Socket disconnected');
                    initialized = false;
                });
                
                socket.on('users_online', (users: string[]) => {
                    update(state => ({ ...state, usersOnline: users }));
                    console.log('Users online:', users);
                });
            } else if (socket.connected && !initialized && username) {
                socket.emit('user_join', username);
                initialized = true;
            }
            
            return socket;
        },
        
        disconnect: () => {
            if (socket) {
                socket.disconnect();
                socket = null;
                initialized = false;
            }
        },
        
        getTasks: () => {
            if (socket && socket.connected) {
                socket.emit('get_all_tasks');
            } else {
                console.error('Socket not connected. Cannot get tasks.');
            }
        },
        
        createTask: (taskData: Partial<Task>) => {
            if (socket && socket.connected) {
                socket.emit('create_task', taskData);
            } else {
                console.error('Socket not connected. Cannot create task.');
            }
        },
        
        updateTask: (taskId: string, updates: Partial<Task>) => {
            if (socket && socket.connected) {
                socket.emit('update_task', { taskId, updates });
            } else {
                console.error('Socket not connected. Cannot update task.');
            }
        },
        
        deleteTask: (taskId: string) => {
            if (socket && socket.connected) {
                socket.emit('delete_task', taskId);
            } else {
                console.error('Socket not connected. Cannot delete task.');
            }
        },
        
        subscribeToTasks: (
            onTasksUpdate: (tasks: Task[]) => void,
            onTaskCreated: (task: Task) => void,
            onTaskUpdated: (task: Task) => void,
            onTaskDeleted: (taskId: string) => void
        ) => {
            if (!socket) return;
            
            socket.on('tasks_update', onTasksUpdate);
            
            socket.on('task_created', onTaskCreated);
            
            socket.on('task_updated', onTaskUpdated);

            socket.on('task_deleted', onTaskDeleted);
            
            return () => {
                socket?.off('tasks_update', onTasksUpdate);
                socket?.off('task_created', onTaskCreated);
                socket?.off('task_updated', onTaskUpdated);
                socket?.off('task_deleted', onTaskDeleted);
            };
        },
    };
};

export const socketService = createSocketStore();
