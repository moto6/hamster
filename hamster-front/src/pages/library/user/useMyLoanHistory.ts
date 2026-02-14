import {useState, useEffect} from 'react';
import type {LoanDetail, PaginatedResponse} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/libraryClient.ts";

interface MyLoanFilter {
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
}

function getDefaultLoanHistDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 기본 30일

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

function validateLoanHistDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // endDate는 오늘이어야 함
  const endDateObj = new Date(endDate);
  endDateObj.setHours(0, 0, 0, 0);
  if (endDateObj.getTime() !== today.getTime()) {
    return false;
  }
  
  // 최대 180일
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 180;
}

// ===== Hook =====

export function useMyLoanHistory() {
  const defaultRange = getDefaultLoanHistDateRange();
  
  const [loans, setLoans] = useState<PaginatedResponse<LoanDetail>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<MyLoanFilter>({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    page: 0,
    pageSize: 20,
  });
  const [dateError, setDateError] = useState<string>('');

  const fetchLoans = async () => {
    if (!validateLoanHistDateRange(filter.startDate, filter.endDate)) {
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

      const response = await libraryApiClient.get<PaginatedResponse<LoanDetail>>(
        `/user/my-loans?${params.toString()}`
      );
      setLoans(response.data);
    } catch (error) {
      console.error('Failed to fetch my loans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  return {
    loans,
    loading,
    filter,
    setFilter,
    dateError,
    refetch: fetchLoans,
  };
}
