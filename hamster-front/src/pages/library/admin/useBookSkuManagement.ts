import {useEffect, useState} from 'react';
import {libraryApiClient} from "@/core/libraryClient.ts";
import type {BookSkuMaster, PaginatedResponse} from "@/pages/library/libraryTypes.ts";

interface BookSkuFormData {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishYear: number;
    callNumber: string;
    category: string;
    description?: string;
    coverImageUrl?: string;
    totalCopies: number;
}

interface BookSkuFilter {
    keyword?: string;
    category?: string;
    page: number;
    pageSize: number;
}

export function useBookSkuManagement() {
    const [books, setBooks] = useState<PaginatedResponse<BookSkuMaster>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<BookSkuFilter>({
        keyword: '',
        category: '',
        page: 0,
        pageSize: 20,
    });

    const updatePageSize = (size: number) => {
        setFilter(prev => ({
            ...prev,
            pageSize: size,
            page: 0 // 갯수가 바뀌면 1페이지(0)로 리셋
        }));
    };

    // Fetch books
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.keyword) params.append('keyword', filter.keyword);
            if (filter.category) params.append('category', filter.category);
            params.append('page', filter.page.toString());
            params.append('pageSize', filter.pageSize.toString());
            const response = await libraryApiClient.get<PaginatedResponse<BookSkuMaster>>(
                `/book/sku?${params.toString()}`
            );
            setBooks(response.data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create book
    const createBook = async (data: BookSkuFormData): Promise<boolean> => {
        try {
            await libraryApiClient.post('/book/sku', data);
            await fetchBooks();
            return true;
        } catch (error) {
            console.error('Failed to create book:', error);
            return false;
        }
    };

    // Update book
    const updateBook = async (id: number, data: Partial<BookSkuFormData>): Promise<boolean> => {
        try {
            await libraryApiClient.put(`/book/sku/${id}`, data);
            await fetchBooks();
            return true;
        } catch (error) {
            console.error('Failed to update book:', error);
            return false;
        }
    };

    // Delete book
    const deleteBook = async (id: number): Promise<boolean> => {
        try {
            await libraryApiClient.delete(`/book/sku/${id}`);
            await fetchBooks();
            return true;
        } catch (error) {
            console.error('Failed to delete book:', error);
            return false;
        }
    };

    // 2. filter가 변경될 때마다 자동 페칭 (선택 사항)
    useEffect(() => {
        fetchBooks();
    }, [filter.pageSize, filter.page, filter.keyword]);

    return {
        books,
        loading,
        filter,
        setFilter,
        createBook,
        updateBook,
        updatePageSize,
        deleteBook,
        refetch: fetchBooks,
    };
}
