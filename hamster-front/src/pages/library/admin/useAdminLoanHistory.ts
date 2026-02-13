import {useEffect, useState} from 'react';
import type {LoanDetail, LoanMaster, PaginatedResponse} from '@/pages/library/libraryTypes.ts';
import {libraryApiClient} from "@/core/libraryClient.ts";

const SEARCH_TYPES = ['유저이름', '도서명'] as const;
type SearchType = typeof SEARCH_TYPES[number];

interface LoanHistoryFilter {
    searchType: SearchType;
    keyword: string;
    startDate: string;
    endDate: string;
    page: number;
    pageSize: number;
}

interface LoanHistoryResult extends LoanMaster {
    details: LoanDetail[];
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
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 180;
}

// ===== Hook =====

export function useAdminLoanHistory() {
    const defaultRange = getDefaultDateRange();

    const [loans, setLoans] = useState<PaginatedResponse<LoanHistoryResult>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<LoanHistoryFilter>({
        searchType: '유저이름',
        keyword: '',
        startDate: defaultRange.startDate,
        endDate: defaultRange.endDate,
        page: 0,
        pageSize: 20,
    });
    const [dateError, setDateError] = useState<string>('');

    const fetchLoans = async () => {
        if (!validateDateRange(filter.startDate, filter.endDate)) {
            setDateError('조회 기간은 최대 180일까지 가능합니다');
            return;
        }
        setDateError('');

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('searchType', filter.searchType);
            if (filter.keyword) params.append('keyword', filter.keyword);
            params.append('startDate', filter.startDate);
            params.append('endDate', filter.endDate);
            params.append('page', filter.page.toString());
            params.append('pageSize', filter.pageSize.toString());

            const response = await libraryApiClient.get<PaginatedResponse<LoanHistoryResult>>(
                `/admin/loan-history?${params.toString()}`
            );
            setLoans(response.data);
        } catch (error) {
            console.error('Failed to fetch loan history:', error);
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
        SEARCH_TYPES,
        refetch: fetchLoans,
    };
}
