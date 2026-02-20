import {useEffect, useState} from 'react';
import {RANKING_PERIODS, type RankingBook, type RankingPeriod} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/http/libraryClient.ts";

export function useRealtimeRanking() {
    const [rankings, setRankings] = useState<RankingBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<RankingPeriod>('1시간');

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('period', period);

            const response = await libraryApiClient.get<RankingBook[]>(
                `/api/v0/library/books/rankings?${params.toString()}`
            );
            //setRankings(response.data); // 배열이 아닐때 빈값만 던지는 타입검증
            if (Array.isArray(response.data)) {
                setRankings(response.data);
            } else {
                console.error(response.data);
                setRankings([]);
            }
        } catch (error) {
            console.error('Failed to fetch realtime rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, [period]);

    return {
        rankings,
        loading,
        period,
        setPeriod,
        RANKING_PERIODS,
        refetch: fetchRankings,
    };
}
