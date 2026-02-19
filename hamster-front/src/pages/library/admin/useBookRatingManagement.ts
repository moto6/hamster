import {useState, useEffect} from 'react';
import {libraryApiClient} from "@/core/libraryClient.ts";
import type {BookRating, BookRatingStats, PaginatedResponse} from "@/pages/library/libraryTypes.ts";

// ===== Interfaces =====

interface RatingFilter {
  keyword?: string;
  page: number;
  pageSize: number;
}

interface RatingWithStats extends BookRating {
  stats?: BookRatingStats;
}

// ===== Hook =====

export function useBookRatingManagement() {
  const [ratings, setRatings] = useState<PaginatedResponse<RatingWithStats>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RatingFilter>({
    keyword: '',
    page: 0,
    pageSize: 20,
  });

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.keyword) params.append('keyword', filter.keyword);
      params.append('page', filter.page.toString());
      params.append('pageSize', filter.pageSize.toString());

      const response = await libraryApiClient.get<PaginatedResponse<RatingWithStats>>(
        `/api/v0/admin/library/books/ratings?${params.toString()}`
      );
      setRatings(response.data);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (id: number): Promise<boolean> => {
    try {
      await libraryApiClient.delete(`/admin/ratings/${id}`);
      await fetchRatings();
      return true;
    } catch (error) {
      console.error('Failed to delete rating:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [filter]);

  return {
    ratings,
    loading,
    filter,
    setFilter,
    deleteRating,
    refetch: fetchRatings,
  };
}
