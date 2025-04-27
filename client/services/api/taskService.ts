import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import { Task } from '@/types/task';

export interface CreateTaskRequest {
    name: string;
    description?: string;
    categoryId: string;
    timerMethod: string;
}

export interface UpdateTaskRequest {
    name?: string;
    description?: string;
    categoryId?: string;
    timerMethod?: string;
}

export interface TasksQueryParams {
    page?: number;
    limit?: number;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

class TaskService {
    async getTasks(params?: TasksQueryParams) {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `${ENDPOINTS.TASKS}?${queryParams.toString()}`;
        return apiClient.get<{ tasks: Task[]; total: number; page: number; limit: number }>(endpoint);
    }

    async getTask(id: string) {
        return apiClient.get<Task>(ENDPOINTS.TASK(id));
    }

    async createTask(data: CreateTaskRequest) {
        return apiClient.post<Task>(ENDPOINTS.TASKS, data);
    }

    async updateTask(id: string, data: UpdateTaskRequest) {
        return apiClient.put<Task>(ENDPOINTS.TASK(id), data);
    }

    async deleteTask(id: string) {
        return apiClient.delete(ENDPOINTS.TASK(id));
    }

    async syncTasks(tasks: Task[]) {
        return apiClient.post<{ tasks: Task[] }>(ENDPOINTS.TASKS + '/sync', { tasks });
    }
}

export const taskService = new TaskService();
export default taskService;