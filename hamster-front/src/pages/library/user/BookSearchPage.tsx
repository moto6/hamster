import {useState} from 'react';
import {useBookSearch} from './useBookSearch.ts';
import {Button} from '@/components/library/button.tsx';
import {Input} from '@/components/library/input.tsx';
import {Label} from '@/components/core/label.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/library/select.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {ArrowRightLeft, BookmarkPlus, BookOpen, Search} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';

export function BookSearchPage() {
    const {
        books,
        loading,
        filter,
        setFilter,
        //searchBooks,
        createReservation,
        requestInterLibraryLoan,
        SEARCH_TYPES
    } = useBookSearch();
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        setFilter({...filter, keyword, page: 0});
    };

    const handleReservation = async (bookSkuId: number, title: string) => {
        if (confirm(`"${title}" 도서를 예약하시겠습니까?`)) {
            const success = await createReservation(bookSkuId);
            if (success) {
                alert('예약이 완료되었습니다');
            } else {
                alert('예약 중 오류가 발생했습니다');
            }
        }
    };

    const handleInterLibraryLoan = async (bookSkuId: number, title: string) => {
        if (confirm(`"${title}" 도서를 상호대차 신청하시겠습니까?`)) {
            const success = await requestInterLibraryLoan(bookSkuId);
            if (success) {
                alert('상호대차 신청이 완료되었습니다');
            } else {
                alert('신청 중 오류가 발생했습니다');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BookOpen className="size-8 text-blue-600"/>
                <div>
                    <h1>자료 검색</h1>
                    <p className="text-sm text-slate-500 mt-1">도서관 소장 자료를 검색합니다</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>검색 조건</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>검색 항목</Label>
                            <Select
                                value={filter.searchType}
                                onValueChange={(value) => setFilter({
                                    ...filter,
                                    searchType: value as typeof filter.searchType
                                })}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {SEARCH_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label>검색어</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="검색어를 입력하세요..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e?.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                                <Button onClick={handleSearch}>
                                    <Search className="size-4 mr-2"/>
                                    검색
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>도서명</TableHead>
                                <TableHead>저자</TableHead>
                                <TableHead>출판사</TableHead>
                                <TableHead>출판년도</TableHead>
                                <TableHead>청구기호</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>예약</TableHead>
                                <TableHead>반납예정일</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                                        검색 중...
                                    </TableCell>
                                </TableRow>
                            ) : (books?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                                        {filter.keyword ? '검색 결과가 없습니다' : '검색어를 입력하세요'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                books.content.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.publisher}</TableCell>
                                        <TableCell>{book.publishYear}</TableCell>
                                        <TableCell className="font-mono text-sm">{book.callNumber}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <Badge
                                                    variant={book.status === '대출가능' ? 'secondary' : 'default'}
                                                >
                                                    {book.status}
                                                </Badge>
                                                {book.statusDetail && (
                                                    <div className="text-xs text-slate-500">
                                                        ({book.statusDetail})
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {book.reservationCount && book.reservationCount > 0
                                                ? `${book.reservationCount}명`
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {book.expectedReturnDate
                                                ? new Date(book.expectedReturnDate).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {book.status === '대출가능' ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleInterLibraryLoan(book.id, book.title)}
                                                >
                                                    <ArrowRightLeft className="size-4 mr-1"/>
                                                    상호대차
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReservation(book.id, book.title)}
                                                >
                                                    <BookmarkPlus className="size-4 mr-1"/>
                                                    도서예약
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {books.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4">
                        {filter.page + 1} / {books.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= books.totalPages - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
