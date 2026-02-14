import {useMyLoanHistory} from './useMyLoanHistory.ts';
import {Button} from '@/components/library/button.tsx';
import {Input} from '@/components/library/input.tsx';
import {Label} from '@/components/core/label.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {AlertCircle, BookOpen, Search} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';

export function MyLoanHistoryPage() {
    const {loans, loading, filter, setFilter, dateError} = useMyLoanHistory();

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            'ACTIVE': 'default',
            'RETURNED': 'secondary',
            'OVERDUE': 'destructive',
        };
        const labels: Record<string, string> = {
            'ACTIVE': '대출중',
            'RETURNED': '반납완료',
            'OVERDUE': '연체중',
        };
        return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BookOpen className="size-8 text-blue-600"/>
                <div>
                    <h1>나의 대출 기록</h1>
                    <p className="text-sm text-slate-500 mt-1">나의 도서 대출 이력을 확인합니다</p>
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
                            <TableRow>
                                <TableHead>도서명</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>청구기호</TableHead>
                                <TableHead>대출일</TableHead>
                                <TableHead>반납예정일</TableHead>
                                <TableHead>반납일</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        로딩 중...
                                    </TableCell>
                                </TableRow>
                            ) : (loans?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        대출 기록이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loans.content.map((loan) => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                                        <TableCell className="font-mono text-sm">{loan.bookIsbn}</TableCell>
                                        <TableCell className="font-mono text-sm">{loan.callNumber}</TableCell>
                                        <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {loan.returnDate
                                                ? new Date(loan.returnDate).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {loans.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4">
                        {filter.page + 1} / {loans.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= loans.totalPages - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
