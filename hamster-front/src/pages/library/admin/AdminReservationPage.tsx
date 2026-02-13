import {useAdminReservation} from './useAdminReservation.ts';
import {Button} from '@/components/library/button.tsx';
import {Input} from "@/components/library/Input.tsx";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {AlertCircle, Search} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';
import type {BookReservationStatus} from "@/pages/library/libraryTypes.ts";
import {Label} from "@/components/core/Label.tsx";


export function AdminReservationPage() {
    const {reservations, loading, filter, setFilter, dateError} = useAdminReservation();

    const getStatusBadge = (status: BookReservationStatus) => {
        const variants: Record<BookReservationStatus, "default" | "secondary" | "destructive" | "outline"> = {
            '예약대기': 'default',
            '예약대출가능': 'secondary',
            '예약취소': 'outline',
            '대출됨': 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1>예약 내역 관리</h1>
                <p className="text-sm text-slate-500 mt-1">도서 예약 현황을 확인합니다</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>검색 조건</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>시작일</Label>
                            <Input
                                type="date"
                                value={filter.startDate}
                                onChange={(e) => setFilter({...filter, startDate: e.target.value, page: 0})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>종료일</Label>
                            <Input
                                type="date"
                                value={filter.endDate}
                                onChange={(e) => setFilter({...filter, endDate: e.target.value, page: 0})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>유저 이메일</Label>
                            <Input
                                placeholder="이메일 검색..."
                                value={filter.userEmail}
                                onChange={(e) => setFilter({...filter, userEmail: e.target.value, page: 0})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>도서 제목</Label>
                            <Input
                                placeholder="도서명 검색..."
                                value={filter.bookTitle}
                                onChange={(e) => setFilter({...filter, bookTitle: e.target.value, page: 0})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>도서 ISBN</Label>
                            <Input
                                placeholder="ISBN 검색..."
                                value={filter.bookIsbn}
                                onChange={(e) => setFilter({...filter, bookIsbn: e.target.value, page: 0})}
                            />
                        </div>
                    </div>

                    {dateError && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="size-4"/>
                            {dateError}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button>
                            <Search className="size-4 mr-2"/>
                            조회
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>예약번호</TableHead>
                                <TableHead>예약자</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>도서명</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>예약일시</TableHead>
                                <TableHead>대출가능일</TableHead>
                                <TableHead>순번</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                                        로딩 중...
                                    </TableCell>
                                </TableRow>
                                //) : reservations.content.length === 0 ? (
                            ) : (reservations?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                                        조회된 예약 내역이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reservations.content.map((reservation) => (
                                    <TableRow key={reservation.id}>
                                        <TableCell className="font-mono">#{reservation.id}</TableCell>
                                        <TableCell className="font-medium">{reservation.userName}</TableCell>
                                        <TableCell>{reservation.userEmail}</TableCell>
                                        <TableCell>{reservation.bookTitle}</TableCell>
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
