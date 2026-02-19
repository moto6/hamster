import {useState, useEffect} from 'react';
import type {LoanOverdue, PaginatedResponse} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/libraryClient.ts";

// ===== Interfaces =====

interface OverdueFilter {
  keyword?: string;
  page: number;
  pageSize: number;
}

// ===== Hook =====

export function useOverdueManagement() {
  const [overdues, setOverdues] = useState<PaginatedResponse<LoanOverdue>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OverdueFilter>({
    keyword: '',
    page: 0,
    pageSize: 20,
  });

  const fetchOverdues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.keyword) params.append('keyword', filter.keyword);
      params.append('page', filter.page.toString());
      params.append('pageSize', filter.pageSize.toString());

      const response = await libraryApiClient.get<PaginatedResponse<LoanOverdue>>(
        `/api/v0/admin/books/overdue?${params.toString()}`
      );
      setOverdues(response.data);
    } catch (error) {
      console.error('Failed to fetch overdues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdues();
  }, [filter]);

  return {
    overdues,
    loading,
    filter,
    setFilter,
    refetch: fetchOverdues,
  };
}
