import { writable } from 'svelte/store';
import type { Task } from '../models/task';

type TasksState = {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    isLoading: false,
    error: null
};

const mockTasks: Task[] = [];

function createTaskStore() {
    const { subscribe, set, update } = writable<TasksState>({
        ...initialState,
        tasks: [...mockTasks]
    });

    return {
        subscribe,
    
        loadTasks: async () => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                
                update(state => ({
                    ...state,
                    tasks: [...mockTasks],
                    isLoading: false
                }));
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err.message || 'Failed to load tasks'
                }));
            }
        },
        addTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                
                const now = new Date().toISOString();
                const newTask: Task = {
                    ...task,
                    id: Date.now().toString(),
                    createdAt: now,
                    updatedAt: now
                };
                
                update(state => ({
                    ...state,
                    tasks: [...state.tasks, newTask],
                    isLoading: false
                }));
                
                return newTask;
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err.message || 'Failed to add task'
                }));
                return null;
            }
        },
        
        updateTask: async (id: string, updates: Partial<Task>) => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                
                update(state => {
                    const taskIndex = state.tasks.findIndex(t => t.id === id);
                    
                    if (taskIndex === -1) {
                        throw new Error('Task not found');
                    }
                    
                    const updatedTasks = [...state.tasks];
                    updatedTasks[taskIndex] = {
                        ...updatedTasks[taskIndex],
                        ...updates
                    };
                    
                    return {
                        ...state,
                        tasks: updatedTasks,
                        isLoading: false
                    };
                });
                
                return true;
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err.message || 'Failed to update task'
                }));
                return false;
            }
        },
        
        deleteTask: async (id: string) => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                
                update(state => ({
                    ...state,
                    tasks: state.tasks.filter(t => t.id !== id),
                    isLoading: false
                }));
                
                return true;
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err.message || 'Failed to delete task'
                }));
                return false;
            }
        },

        clearError: () => {
            update(state => ({ ...state, error: null }));
        }
    };
}

export const taskStore = createTaskStore();
