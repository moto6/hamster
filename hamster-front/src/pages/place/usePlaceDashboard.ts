import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ==========================================
// 1. Interfaces
// ==========================================
export interface PlaceSummary {
    totalPlaces: number;
    activeReservations: number;
    todayBookings: number;
    occupancyRate: number;
}

export interface PlaceReservation {
    id: string;
    placeName: string;
    userName: string;
    startTime: string;
    endTime: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export interface PlaceDashboardData {
    summary: PlaceSummary;
    recentReservations: PlaceReservation[];
}

// ==========================================
// 2. Mock Data (나중에 이 상수만 수정하면 됨)
// ==========================================
const IS_MOCK = true; // 💡 false로 바꾸면 실제 API를 호출합니다.

const PLACE_DASHBOARD_MOCK: PlaceDashboardData = {
    summary: {
        totalPlaces: 12,
        activeReservations: 4,
        todayBookings: 8,
        occupancyRate: 65,
    },
    recentReservations: [
        { id: '1', placeName: '대회의실 A', userName: '김햄스터', startTime: '2026-02-11T14:00', endTime: '2026-02-11T16:00', status: 'CONFIRMED' },
        { id: '2', placeName: '소회의실 B', userName: '이람쥐', startTime: '2026-02-11T15:30', endTime: '2026-02-11T17:00', status: 'PENDING' },
        { id: '3', placeName: '창의세미나실', userName: '박거북', startTime: '2026-02-11T10:00', endTime: '2026-02-11T12:00', status: 'CANCELLED' },
    ]
};

// ==========================================
// 3. Custom Hook
// ==========================================
export function usePlaceDashboard() {
    const [data, setData] = useState<PlaceDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (IS_MOCK) {
                // 모킹 모드: 0.5초 대기 후 상수 데이터 반환
                await new Promise(resolve => setTimeout(resolve, 500));
                setData(PLACE_DASHBOARD_MOCK);
            } else {
                // 실제 API 모드: axios 호출
                const response = await axios.get<PlaceDashboardData>('http://localhost:8080/api/places/dashboard');
                setData(response.data);
            }
        } catch (err: any) {
            console.error('Data Fetch Error:', err);
            setError(err.message || '데이터를 가져오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return { data, isLoading, error, refetch: fetchDashboard };
}