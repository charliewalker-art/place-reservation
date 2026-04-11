import type { AuthResponse, LoginRequest } from '../types/auth';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }

        return response.json();
    },

    saveToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    logout: (): void => {
        localStorage.removeItem('token');
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    },
};