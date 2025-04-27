import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import { Category } from '@/types/task';

export interface CreateCategoryRequest {
    name: string;
    color: {
        bg: string;
        text: string;
    };
}

export interface UpdateCategoryRequest {
    name?: string;
    color?: {
        bg: string;
        text: string;
    };
}

class CategoryService {
    async getCategories() {
        return apiClient.get<Category[]>(ENDPOINTS.CATEGORIES);
    }

    async getCategory(id: string) {
        return apiClient.get<Category>(ENDPOINTS.CATEGORY(id));
    }

    async createCategory(data: CreateCategoryRequest) {
        return apiClient.post<Category>(ENDPOINTS.CATEGORIES, data);
    }

    async updateCategory(id: string, data: UpdateCategoryRequest) {
        return apiClient.put<Category>(ENDPOINTS.CATEGORY(id), data);
    }

    async deleteCategory(id: string) {
        return apiClient.delete(ENDPOINTS.CATEGORY(id));
    }

    async syncCategories(categories: Category[]) {
        return apiClient.post<{ categories: Category[] }>(ENDPOINTS.CATEGORIES + '/sync', { categories });
    }
}

export const categoryService = new CategoryService();
export default categoryService;