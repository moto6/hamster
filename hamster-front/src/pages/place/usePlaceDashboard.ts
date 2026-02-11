import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {mockDelay, PLACE_DASHBOARD_MOCK} from "@/core/mock/mockData.ts";
import type {ReservationStatus} from "@/pages/place/useSchedule.ts";

export interface PlaceSummary {
    totalPlaces: number;
    activeReservations: number;
    todayBookings: number;
    occupancyRate: number;
}

export interface ReservationSummary {
    reservationId: string;
    placeName: string;
    userName: string;
    startTime: string;
    endTime: string;
    status: ReservationStatus;
}

export interface PlaceDashboardDto {
    summary: PlaceSummary;
    recentReservations: ReservationSummary[];
}

const IS_MOCK = true; // 💡 false로 바꾸면 실제 API를 호출합니다.

export function usePlaceDashboard() {
    const [data, setData] = useState<PlaceDashboardDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (IS_MOCK) {
                // 모킹 모드: 0.5초 대기 후 상수 데이터 반환
                await mockDelay();
                setData(PLACE_DASHBOARD_MOCK);
            } else {
                // 실제 API 모드: axios 호출
                const response = await axios.get<PlaceDashboardDto>('http://localhost:8080/api/places/dashboard');
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