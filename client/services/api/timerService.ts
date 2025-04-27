import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import { TimerSession } from '@/types/task';

export interface StartSessionRequest {
    taskId: string;
    startTime: number;
    timerMethod: string;
}

export interface StopSessionRequest {
    endTime: number;
    duration: number;
}

export interface PauseSessionRequest {
    pausedAt: number;
}

export interface ResumeSessionRequest {
    resumedAt: number;
    pauseDuration: number;
}

export interface SessionsQueryParams {
    taskId?: string;
    startDate?: string;
    endDate?: string;
    isCompleted?: boolean;
    page?: number;
    limit?: number;
}

class TimerService {
    async getSessions(params?: SessionsQueryParams) {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const endpoint = `${ENDPOINTS.SESSIONS}?${queryParams.toString()}`;
        return apiClient.get<{ sessions: TimerSession[]; total: number; page: number; limit: number }>(endpoint);
    }

    async getSession(id: string) {
        return apiClient.get<TimerSession>(ENDPOINTS.SESSION(id));
    }

    async startSession(data: StartSessionRequest) {
        return apiClient.post<TimerSession>(ENDPOINTS.SESSIONS, data);
    }

    async stopSession(id: string, data: StopSessionRequest) {
        return apiClient.put<TimerSession>(ENDPOINTS.SESSION(id) + '/stop', data);
    }

    async pauseSession(id: string, data: PauseSessionRequest) {
        return apiClient.put<TimerSession>(ENDPOINTS.SESSION(id) + '/pause', data);
    }

    async resumeSession(id: string, data: ResumeSessionRequest) {
        return apiClient.put<TimerSession>(ENDPOINTS.SESSION(id) + '/resume', data);
    }

    async deleteSession(id: string) {
        return apiClient.delete(ENDPOINTS.SESSION(id));
    }

    async syncSessions(sessions: TimerSession[]) {
        return apiClient.post<{ sessions: TimerSession[] }>(ENDPOINTS.SESSIONS + '/sync', { sessions });
    }
}

export const timerService = new TimerService();
export default timerService;