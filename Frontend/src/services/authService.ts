import api from '../utils/axios';

export interface User {
    id: string;
    name: string;
    email: string;
    userType: 'user' | 'business';
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    userType: 'user' | 'business';
}

export interface LoginData {
    email: string;
    password: string;
}

// Register new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    
    // Throw error if login failed
    if (!response.data.success || !response.data.user) {
        throw new Error(response.data.message || 'Invalid credentials');
    }
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
};

// Forgot password
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

// Reset password
export const resetPassword = async (resetToken: string, newPassword: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/reset-password', { resetToken, newPassword });
    return response.data;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

// Get stored user
export const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
