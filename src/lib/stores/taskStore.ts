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

function createTaskStore() {
    const { subscribe, set, update } = writable<TasksState>({
        ...initialState,
        tasks: []
    });

    return {
        subscribe,
        set,
        update,
    
        loadTasks: async () => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                  update(state => ({
                    ...state,
                    isLoading: false
                }));
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err instanceof Error ? err.message : 'Failed to load tasks'
                }));
            }
        },

        setTasks: (tasks: Task[]) => {
            update(state => ({
                ...state,
                tasks,
                isLoading: false
            }));
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
                    error: err instanceof Error ? err.message : 'Failed to add task'
                }));
                return null;
            }
        }, 
        addOrUpdateTask: (task: Task) => {
            if (!task || !task.id) {
                return;
            }

            update(state => {
                const existingTaskIndex = state.tasks.findIndex(t => t.id === task.id);
                if (existingTaskIndex === -1) {
                    return {
                        ...state,
                        tasks: [...state.tasks, { ...task }],
                        isLoading: false
                    };
                } else {
                    const newTasks = [...state.tasks];
                    newTasks[existingTaskIndex] = { ...task };
                    return {
                        ...state,
                        tasks: newTasks,
                        isLoading: false
                    };
                }
            });
             
            setTimeout(() => {
                let storeState: TasksState | undefined;
                const unsubscribe = subscribe(s => { storeState = s; });
                unsubscribe();
            }, 10);
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
                        ...updates,
                        updatedAt: new Date().toISOString()
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
                    error: err instanceof Error ? err.message : 'Failed to update task'
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
                    error: err instanceof Error ? err.message : 'Failed to delete task'
                }));
                return false;
            }
        },
        
        removeTask: (taskId: string) => {
            update(state => ({
                ...state,
                tasks: state.tasks.filter(t => t.id !== taskId)
            }));
        },

        clearError: () => {
            update(state => ({ ...state, error: null }));
        }
    };
}

export const taskStore = createTaskStore();
