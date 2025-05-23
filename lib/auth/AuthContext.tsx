import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthContextType, User } from './types';
import { useAuthStore } from '../store/useAuthStore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USER: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: storedUser, token: storedToken, setAuth, clearAuth } = useAuthStore();
    const [user, setUser] = useState<User | null>(storedUser);
    const [token, setToken] = useState<string | null>(storedToken);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync Zustand state with local state
    useEffect(() => {
        setUser(storedUser);
        setToken(storedToken);
    }, [storedUser, storedToken]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (email === 'test@example.com' && password === 'password') {
                const mockToken = 'mock-jwt-token';
                setAuth(MOCK_USER, mockToken);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setAuth]);

    const register = useCallback(async (email: string, password: string, name: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newUser: User = {
                id: Math.random().toString(),
                email,
                name,
            };

            const mockToken = 'mock-jwt-token';
            setAuth(newUser, mockToken);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setAuth]);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));

            clearAuth();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [clearAuth]);

    const value = {
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 