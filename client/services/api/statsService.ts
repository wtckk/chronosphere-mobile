import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import { UserStats } from '@/types/task';

export interface StatsQueryParams {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
}

export interface DailyStats {
    date: string;
    timeSpent: number;
    tasksCompleted: number;
}

export interface WeeklyStats {
    week: string;
    timeSpent: number;
    tasksCompleted: number;
}

class StatsService {
    async getStats(params?: StatsQueryParams) {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `${ENDPOINTS.STATS}?${queryParams.toString()}`;
        return apiClient.get<UserStats>(endpoint);
    }

    async getDailyStats(params?: StatsQueryParams) {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `${ENDPOINTS.STATS_DAILY}?${queryParams.toString()}`;
        return apiClient.get<DailyStats[]>(endpoint);
    }

    async getWeeklyStats(params?: StatsQueryParams) {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `${ENDPOINTS.STATS_WEEKLY}?${queryParams.toString()}`;
        return apiClient.get<WeeklyStats[]>(endpoint);
    }
}

export const statsService = new StatsService();
export default statsService;