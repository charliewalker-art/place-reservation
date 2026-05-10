import type { AuthResponse, LoginRequest } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/auth`;

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }
        const result: AuthResponse = await response.json();
        authService.saveToken(result.token);
        return result;
    },

    register: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de l\'inscription');
        }
        const result: AuthResponse = await response.json();
        authService.saveToken(result.token);
        return result;
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