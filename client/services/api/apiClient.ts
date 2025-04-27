import { Platform } from 'react-native';
import { API_CONFIG, getHeaders, ERROR_MESSAGES } from './config';
import { useAuthStore } from '@/store/authStore';

// API response interface
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
    success: boolean;
}

// API error interface
export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

// Timeout promise
const timeoutPromise = (ms: number) => {
    return new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout'));
        }, ms);
    });
};

// Handle API errors
const handleApiError = async (response: Response): Promise<ApiError> => {
    try {
        const data = await response.json();

        // Handle token expiration
        if (response.status === 401) {
            const { logout } = useAuthStore.getState();
            logout();
        }

        return {
            status: response.status,
            message: data.message || getErrorMessageByStatus(response.status),
            errors: data.errors,
        };
    } catch (error) {
        return {
            status: response.status,
            message: getErrorMessageByStatus(response.status),
        };
    }
};

// Get error message by status code
const getErrorMessageByStatus = (status: number): string => {
    switch (status) {
        case 400:
            return ERROR_MESSAGES.VALIDATION_ERROR;
        case 401:
            return ERROR_MESSAGES.UNAUTHORIZED;
        case 403:
            return ERROR_MESSAGES.FORBIDDEN;
        case 404:
            return ERROR_MESSAGES.NOT_FOUND;
        case 500:
        case 502:
        case 503:
        case 504:
            return ERROR_MESSAGES.SERVER_ERROR;
        default:
            return ERROR_MESSAGES.DEFAULT;
    }
};

// API client class
class ApiClient {
    private baseUrl: string;
    private timeout: number;

    constructor(baseUrl: string, timeout: number) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    // Generic request method
    private async request<T>(
        endpoint: string,
        method: string,
        data?: any,
        customHeaders?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { ...getHeaders(), ...customHeaders };

        const options: RequestInit = {
            method,
            headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            // Race between fetch and timeout
            const response = await Promise.race([
                fetch(url, options),
                timeoutPromise(this.timeout),
            ]);

            if (!response.ok) {
                const error = await handleApiError(response);
                throw error;
            }

            const responseData = await response.json();

            return {
                data: responseData.data,
                status: response.status,
                message: responseData.message,
                success: true,
            };
        } catch (error: any) {
            if (error.message === 'Request timeout') {
                throw {
                    status: 408,
                    message: ERROR_MESSAGES.TIMEOUT_ERROR,
                };
            }

            if (error.message === 'Network request failed') {
                throw {
                    status: 0,
                    message: ERROR_MESSAGES.NETWORK_ERROR,
                };
            }

            throw error;
        }
    }

    // HTTP methods
    async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'GET', undefined, customHeaders);
    }

    async post<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'POST', data, customHeaders);
    }

    async put<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PUT', data, customHeaders);
    }

    async patch<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PATCH', data, customHeaders);
    }

    async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'DELETE', undefined, customHeaders);
    }
}

// Create API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);

// Export default instance
export default apiClient;