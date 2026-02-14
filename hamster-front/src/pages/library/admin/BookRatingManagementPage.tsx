import {useBookRatingManagement} from './useBookRatingManagement.ts';
import {Button} from '@/components/library/button.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {Search, Star, Trash2} from 'lucide-react';
import {Input} from "@/components/library/input.tsx";

export function BookRatingManagementPage() {
    const {ratings, loading, filter, setFilter, deleteRating} = useBookRatingManagement();

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-4 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const handleDelete = async (id: number) => {
        if (confirm('이 평점을 삭제하시겠습니까?')) {
            await deleteRating(id);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1>도서 평점 관리</h1>
                <p className="text-sm text-slate-500 mt-1">등록된 도서 평점 및 리뷰를 관리합니다</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>검색</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="도서명, ISBN, 작성자 검색..."
                            value={filter.keyword}
                            onChange={(e) => setFilter({...filter, keyword: e.target.value, page: 0})}
                            className="max-w-md"
                        />
                        <Button>
                            <Search className="size-4 mr-2"/>
                            검색
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>도서명</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>작성자</TableHead>
                                <TableHead>평점</TableHead>
                                <TableHead>리뷰</TableHead>
                                <TableHead>작성일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        로딩 중...
                                    </TableCell>
                                </TableRow>
                            ) : (ratings?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        등록된 평점이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ratings.content.map((rating) => (
                                    <TableRow key={rating.id}>
                                        <TableCell className="font-medium">{rating.bookTitle}</TableCell>
                                        <TableCell className="font-mono text-sm">{rating.bookIsbn}</TableCell>
                                        <TableCell>{rating.userName}</TableCell>
                                        <TableCell>{renderStars(rating.rating)}</TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {rating.review || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(rating.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(rating.id)}
                                            >
                                                <Trash2 className="size-4 text-red-500"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {ratings.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4">
                        {filter.page + 1} / {ratings.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= ratings.totalPages - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
