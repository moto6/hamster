import {useEffect, useState} from 'react';
import type {PaginatedResponse, Reservation} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/libraryClient.ts";

// ===== Interfaces =====

interface ReservationFilter {
    startDate: string;
    endDate: string;
    userEmail?: string;
    bookTitle?: string;
    bookIsbn?: string;
    page: number;
    pageSize: number;
}

// ===== Utility Functions =====

function getDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 기본 7일

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    };
}

function validateDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 180;
}

// ===== Hook =====

export function useAdminReservation() {
    const defaultRange = getDefaultDateRange();

    const [reservations, setReservations] = useState<PaginatedResponse<Reservation>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<ReservationFilter>({
        startDate: defaultRange.startDate,
        endDate: defaultRange.endDate,
        userEmail: '',
        bookTitle: '',
        bookIsbn: '',
        page: 0,
        pageSize: 20,
    });
    const [dateError, setDateError] = useState<string>('');

    const fetchReservations = async () => {
        if (!validateDateRange(filter.startDate, filter.endDate)) {
            setDateError('조회 기간은 최대 180일까지 가능합니다');
            return;
        }
        setDateError('');

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('startDate', filter.startDate);
            params.append('endDate', filter.endDate);
            if (filter.userEmail) params.append('userEmail', filter.userEmail);
            if (filter.bookTitle) params.append('bookTitle', filter.bookTitle);
            if (filter.bookIsbn) params.append('bookIsbn', filter.bookIsbn);
            params.append('page', filter.page.toString());
            params.append('pageSize', filter.pageSize.toString());

            const response = await libraryApiClient.get<PaginatedResponse<Reservation>>(
                `/admin/reservations?${params.toString()}`
            );
            setReservations(response.data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [filter]);

    return {
        reservations,
        loading,
        filter,
        setFilter,
        dateError,
        refetch: fetchReservations,
    };
}
