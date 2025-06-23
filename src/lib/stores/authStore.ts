import { writable } from 'svelte/store';
import type { User } from '../models/user';

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);
    if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        
        if (savedToken && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                set({ 
                    user,
                    token: savedToken,
                    isLoading: false,
                    error: null
                });
            } catch (e) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
    }

    return {
        subscribe,
        login: async (username: string = '') => {
            update(state => ({ ...state, isLoading: true, error: null }));
            
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                if (username.trim()) {
                    const mockUser = {
                        id: Math.random().toString(36).substring(2, 15),
                        username: username.trim(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    const token = `token-${Math.random().toString(36).substring(2, 15)}`;

                    if (typeof window !== 'undefined') {
                        localStorage.setItem('auth_token', token);
                        localStorage.setItem('auth_user', JSON.stringify(mockUser));
                    }

                    set({
                        user: mockUser,
                        token: token,
                        isLoading: false,
                        error: null
                    });
                    
                    return true;
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (err) {
                update(state => ({ 
                    ...state, 
                    isLoading: false, 
                    error: err.message || 'Login failed'
                }));
                return false;
            }
        },

        logout: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }

            set(initialState);
        },

        clearError: () => {
            update(state => ({ ...state, error: null }));
        },
        
        isAuthenticated: () => {
            let result = false;
            
            subscribe(state => {
                result = !!state.token;
            })();
            
            return result;
        }
    };
}

export const authStore = createAuthStore();
