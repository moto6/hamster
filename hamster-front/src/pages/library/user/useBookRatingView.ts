import {useState} from 'react';
import type {BookRating, BookRatingStats} from "@/pages/library/libraryTypes.ts";
import {libraryApiClient} from "@/core/http/libraryClient.ts";

interface RatingViewData {
    stats: BookRatingStats;
    ratings: BookRating[];
}

export function useBookRatingView() {
    const [isbn, setIsbn] = useState('');
    const [ratingData, setRatingData] = useState<RatingViewData | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchRatings = async (searchIsbn: string) => {
        if (!searchIsbn.trim()) return;

        setLoading(true);
        try {
            const response = await libraryApiClient.get<RatingViewData>(
                `/library/ratings/${searchIsbn}`
            );
            setRatingData(response.data);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
            setRatingData(null);
        } finally {
            setLoading(false);
        }
    };

    const submitRating = async (
        bookIsbn: string,
        rating: number,
        review?: string
    ): Promise<boolean> => {
        setSubmitting(true);
        try {
            await libraryApiClient.post('/user/ratings', {
                bookIsbn,
                rating,
                review,
            });
            // Refresh ratings
            await fetchRatings(bookIsbn);
            return true;
        } catch (error) {
            console.error('Failed to submit rating:', error);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        isbn,
        setIsbn,
        ratingData,
        loading,
        submitting,
        fetchRatings,
        submitRating,
    };
}
