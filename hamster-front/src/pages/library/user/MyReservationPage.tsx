import {useMyReservation} from './useMyReservation.ts';
import {Button} from '@/components/library/button.tsx';
import {Input} from '@/components/library/input.tsx';
import {Label} from '@/components/core/label.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {AlertCircle, BookmarkCheck, Search, X} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';
import type {BookReservationStatus} from "@/pages/library/libraryTypes.ts";


export function MyReservationPage() {
    const {reservations, loading, filter, setFilter, dateError, cancelReservation} = useMyReservation();

    const getStatusBadge = (status: BookReservationStatus) => {
        const variants: Record<BookReservationStatus, "default" | "secondary" | "destructive" | "outline"> = {
            '예약대기': 'default',
            '예약대출가능': 'secondary',
            '예약취소': 'outline',
            '대출됨': 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const handleCancel = async (id: number) => {
        if (confirm('예약을 취소하시겠습니까?')) {
            await cancelReservation(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BookmarkCheck className="size-8 text-blue-600"/>
                <div>
                    <h1>나의 예약 도서</h1>
                    <p className="text-sm text-slate-500 mt-1">예약한 도서 목록을 확인합니다</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>조회 기간 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div className="space-y-2">
                            <Label>시작일</Label>
                            <Input
                                type="date"
                                value={filter.startDate}
                                onChange={(e) => setFilter({...filter, startDate: e.target.value, page: 0})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>종료일 (오늘)</Label>
                            <Input
                                type="date"
                                value={filter.endDate}
                                onChange={(e) => setFilter({...filter, endDate: e.target.value, page: 0})}
                            />
                        </div>
                    </div>

                    {dateError && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="size-4"/>
                            {dateError}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button>
                            <Search className="size-4 mr-2"/>
                            조회
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                const defaultStart = new Date();
                                defaultStart.setDate(defaultStart.getDate() - 30);
                                setFilter({
                                    ...filter,
                                    startDate: defaultStart.toISOString().split('T')[0],
                                    endDate: today,
                                    page: 0,
                                });
                            }}
                        >
                            최근 30일
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 pb-4">
                                <TableHead className="px-4">도서명</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>예약일시</TableHead>
                                <TableHead>대출가능일</TableHead>
                                <TableHead>예약순번</TableHead>
                                <TableHead>상태</TableHead>
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
                            ) : (reservations?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        예약 내역이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reservations.content.map((reservation) => (
                                    <TableRow key={reservation.id}>
                                        <TableCell className="font-medium">{reservation.bookTitle}</TableCell>
                                        <TableCell className="font-mono text-sm">{reservation.bookIsbn}</TableCell>
                                        <TableCell>
                                            {new Date(reservation.reservationDate).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {reservation.availableDate
                                                ? new Date(reservation.availableDate).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {reservation.queuePosition ? `${reservation.queuePosition}번째` : '-'}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {reservation.status === '예약대기' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancel(reservation.id)}
                                                >
                                                    <X className="size-4 mr-1"/>
                                                    취소
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

            {reservations.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4">
                        {filter.page + 1} / {reservations.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= reservations.totalPages - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
