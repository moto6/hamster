import {useState, useEffect} from 'react';
import type {HotRankingBook, HotRankingParams} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/http/libraryClient.ts";
// ===== Hook =====

export function useHotRanking() {
  const [rankings, setRankings] = useState<HotRankingBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<HotRankingParams>({
    gender: '전체',
    ageGroup: '전체',
    region: '전체',
    subject: '전체',
  });

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('gender', filters.gender);
      params.append('ageGroup', filters.ageGroup);
      params.append('region', filters.region);
      params.append('subject', filters.subject);

      const response = await libraryApiClient.get<{ rankings: HotRankingBook[] }>(
        `/ranking/hot?${params.toString()}`
      );
      setRankings(response.data.rankings);
    } catch (error) {
      console.error('Failed to fetch hot rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [filters]);

  return {
    rankings,
    loading,
    filters,
    setFilters,
    refetch: fetchRankings,
  };
}
