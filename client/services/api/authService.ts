import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import { User } from '@/types/user';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

class AuthService {
    async login(data: LoginRequest) {
        return apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, data);
    }

    async register(data: RegisterRequest) {
        return apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, data);
    }

    async refreshToken(data: RefreshTokenRequest) {
        return apiClient.post<{ token: string }>(ENDPOINTS.REFRESH_TOKEN, data);
    }

    async logout() {
        return apiClient.post(ENDPOINTS.LOGOUT);
    }

    async getUserProfile() {
        return apiClient.get<User>(ENDPOINTS.USER_PROFILE);
    }

    async updateUserProfile(data: Partial<User>) {
        return apiClient.put<User>(ENDPOINTS.USER_PROFILE, data);
    }
}

export const authService = new AuthService();
export default authService;