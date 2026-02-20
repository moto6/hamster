import {useEffect, useState} from 'react';
import {
    type BookSearchParams,
    type BookSearchResult,
    type PaginatedResponse,
    SEARCH_TYPES
} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/http/libraryClient.ts";

export function useBookSearch() {
    const [books, setBooks] = useState<PaginatedResponse<BookSearchResult>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<BookSearchParams>({
        keyword: '',
        searchType: '전체',
        page: 0,
        pageSize: 20,
    });

    const searchBooks = async () => {
        if (!filter.keyword.trim()) {
            setBooks({
                content: [],
                totalElements: 0,
                totalPages: 0,
                currentPage: 0,
                pageSize: 20,
            });
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('keyword', filter.keyword);
            params.append('searchType', filter.searchType);
            params.append('page', filter.page.toString());
            params.append('pageSize', filter.pageSize.toString());

            const response = await libraryApiClient.get<PaginatedResponse<BookSearchResult>>(
                `/library/search?${params.toString()}`
            );
            setBooks(response.data);
        } catch (error) {
            console.error('Failed to search books:', error);
        } finally {
            setLoading(false);
        }
    };

    const createReservation = async (bookSkuId: number): Promise<boolean> => {
        try {
            await libraryApiClient.post('/user/reservations', {bookSkuId});
            return true;
        } catch (error) {
            console.error('Failed to create reservation:', error);
            return false;
        }
    };

    const requestInterLibraryLoan = async (bookSkuId: number): Promise<boolean> => {
        try {
            await libraryApiClient.post('/user/interlibrary-loan', {bookSkuId});
            return true;
        } catch (error) {
            console.error('Failed to request interlibrary loan:', error);
            return false;
        }
    };

    useEffect(() => {
        if (filter.keyword.trim()) {
            searchBooks();
        }
    }, [filter]);

    return {
        books,
        loading,
        filter,
        setFilter,
        searchBooks,
        createReservation,
        requestInterLibraryLoan,
        SEARCH_TYPES,
    };
}
