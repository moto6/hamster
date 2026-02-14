import {useState} from 'react';
import {useBookRatingView} from './useBookRatingView.ts';
import {Button} from '@/components/library/button.tsx';
import {Input} from "@/components/library/input.tsx";
import {Label} from '@/components/core/label.tsx';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {MessageSquare, Search, Star} from 'lucide-react';
import {Textarea} from '@/components/library/textarea.tsx';
import {Progress} from '@/components/library/progress.tsx';

export function BookRatingViewPage() {
    const {isbn, setIsbn, ratingData, loading, submitting, fetchRatings, submitRating} = useBookRatingView();
    const [searchIsbn, setSearchIsbn] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [newReview, setNewReview] = useState('');

    const handleSearch = () => {
        fetchRatings(searchIsbn);
        setIsbn(searchIsbn);
    };

    const handleSubmitRating = async () => {
        if (newRating === 0) {
            alert('평점을 선택해주세요');
            return;
        }

        const success = await submitRating(isbn, newRating, newReview);
        if (success) {
            alert('평점이 등록되었습니다');
            setNewRating(0);
            setNewReview('');
        } else {
            alert('평점 등록 중 오류가 발생했습니다');
        }
    };

    const renderStars = (rating: number, interactive: boolean = false, onClick?: (star: number) => void) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-5 ${interactive ? 'cursor-pointer' : ''} ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`}
                        onClick={() => {
                            if (interactive && onClick) {
                                onClick(star);
                            }
                        }}
                    />
                ))}
            </div>
        );
    };

    const getRatingPercentage = (count: number, total: number) => {
        return total > 0 ? (count / total) * 100 : 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Star className="size-8 text-yellow-500"/>
                <div>
                    <h1>도서 평점 조회</h1>
                    <p className="text-sm text-slate-500 mt-1">도서의 평점과 리뷰를 확인하고 등록합니다</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ISBN으로 검색</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 max-w-md">
                        <Input
                            placeholder="ISBN 입력..."
                            value={searchIsbn}
                            onChange={(e) => setSearchIsbn(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <Button onClick={handleSearch}>
                            <Search className="size-4 mr-2"/>
                            검색
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {loading && (
                <Card>
                    <CardContent className="py-8 text-center text-slate-500">
                        로딩 중...
                    </CardContent>
                </Card>
            )}

            {!loading && ratingData && (
                <>
                    {/* Rating Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{ratingData.stats.bookTitle}</CardTitle>
                            <CardDescription>ISBN: {ratingData.stats.bookIsbn}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
                                    <div className="text-4xl font-bold text-blue-600">
                                        {ratingData.stats.averageRating.toFixed(1)}
                                    </div>
                                    <div className="mt-2">
                                        {renderStars(Math.round(ratingData.stats.averageRating))}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-2">
                                        {ratingData.stats.totalRatings}개의 평가
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratingData.stats.ratingDistribution[
                                            `star${star}` as keyof typeof ratingData.stats.ratingDistribution
                                            ];
                                        const percentage = getRatingPercentage(count, ratingData.stats.totalRatings);

                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-sm w-12">{star}점</span>
                                                <Progress value={percentage} className="flex-1"/>
                                                <span className="text-sm text-slate-500 w-16 text-right">
                                                    {count}개
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Rating */}
                    <Card>
                        <CardHeader>
                            <CardTitle>평점 등록</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>평점</Label>
                                {renderStars(newRating, true, setNewRating)}
                            </div>

                            <div className="space-y-2">
                                <Label>리뷰 (선택사항)</Label>
                                <Textarea
                                    placeholder="이 책에 대한 리뷰를 작성해주세요..."
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <Button onClick={handleSubmitRating} disabled={submitting}>
                                평점 등록
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle>리뷰 목록</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(ratingData?.ratings?.length ?? 0) === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <MessageSquare className="size-12 mx-auto mb-3 text-slate-300"/>
                                    <p>아직 등록된 리뷰가 없습니다</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ratingData.ratings.map((rating) => (
                                        <div key={rating.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium">{rating.userName}</span>
                                                    {renderStars(rating.rating)}
                                                </div>
                                                <span className="text-sm text-slate-500">
                                                    {new Date(rating.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {rating.review && (
                                                <p className="text-sm text-slate-700">{rating.review}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {!loading && !ratingData && isbn && (
                <Card>
                    <CardContent className="py-8 text-center text-slate-500">
                        해당 ISBN의 도서를 찾을 수 없습니다
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
