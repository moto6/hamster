import {useState, useEffect} from 'react';
import type {Reservation, PaginatedResponse} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/libraryClient.ts";
// ===== Interfaces =====

interface MyReservationFilter {
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
}

// ===== Utility Functions =====

function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 기본 30일

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDateObj = new Date(endDate);
  endDateObj.setHours(0, 0, 0, 0);
  if (endDateObj.getTime() !== today.getTime()) {
    return false;
  }
  
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 180;
}

// ===== Hook =====

export function useMyReservation() {
  const defaultRange = getDefaultDateRange();
  
  const [reservations, setReservations] = useState<PaginatedResponse<Reservation>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<MyReservationFilter>({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    page: 0,
    pageSize: 20,
  });
  const [dateError, setDateError] = useState<string>('');

  const fetchReservations = async () => {
    if (!validateDateRange(filter.startDate, filter.endDate)) {
      setDateError('종료일은 오늘이어야 하며, 최대 180일까지 조회 가능합니다');
      return;
    }
    setDateError('');

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('startDate', filter.startDate);
      params.append('endDate', filter.endDate);
      params.append('page', filter.page.toString());
      params.append('pageSize', filter.pageSize.toString());

      const response = await libraryApiClient.get<PaginatedResponse<Reservation>>(
        `/user/my-reservations?${params.toString()}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to fetch my reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: number): Promise<boolean> => {
    try {
      await libraryApiClient.post(`/user/reservations/${id}/cancel`);
      await fetchReservations();
      return true;
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      return false;
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
    cancelReservation,
    refetch: fetchReservations,
  };
}
