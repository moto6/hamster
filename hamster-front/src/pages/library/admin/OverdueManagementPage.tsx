import {useOverdueManagement} from './useOverdueManagement.ts';
import {Button} from '@/components/library/button.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {AlertTriangle, Search} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';
import {Input} from "@/components/library/input.tsx";

export function OverdueManagementPage() {
    const {overdues, loading, filter, setFilter} = useOverdueManagement();

    const getOverdueSeverity = (days: number) => {
        if (days >= 30) return 'destructive';
        if (days >= 14) return 'default';
        return 'secondary';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1>연체 관리</h1>
                    <p className="text-sm text-slate-500 mt-1">대출 연체 중인 도서 현황</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="size-5 text-red-600"/>
                    <div>
                        <div className="text-sm font-medium text-red-900">
                            총 {overdues.totalElements}건의 연체
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>검색</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="연체자명, 도서명, ISBN 검색..."
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
                                <TableHead>연체자</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>도서명</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>청구기호</TableHead>
                                <TableHead>반납예정일</TableHead>
                                <TableHead>연체일수</TableHead>
                                <TableHead>연체료</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                        로딩 중...
                                    </TableCell>
                                </TableRow>
                            ) : (overdues?.content?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                        연체 내역이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                overdues.content.map((overdue) => (
                                    <TableRow key={overdue.id}>
                                        <TableCell className="font-medium">{overdue.userName}</TableCell>
                                        <TableCell>{overdue.userEmail}</TableCell>
                                        <TableCell>{overdue.bookTitle}</TableCell>
                                        <TableCell className="font-mono text-sm">{overdue.bookIsbn}</TableCell>
                                        <TableCell className="font-mono text-sm">{overdue.callNumber}</TableCell>
                                        <TableCell>{new Date(overdue.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={getOverdueSeverity(overdue.overdueDays)}>
                                                {overdue.overdueDays}일
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {overdue.fineAmount
                                                ? `${overdue.fineAmount.toLocaleString()}원`
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {overdues.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4">
                        {filter.page + 1} / {overdues.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= overdues.totalPages - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
