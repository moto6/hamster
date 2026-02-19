import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
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

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
export const API_URL: string = import.meta.env.VITE_API_URL; //`${API_URL}

export function usePlaceDashboard() {
    const [data, setData] = useState<PlaceDashboardDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get<PlaceDashboardDto>(`${API_URL}/api/places/dashboard`);
            setData(response.data);
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