import type {ChangeEvent} from 'react';
import {useAdminLoanHistory} from './useAdminLoanHistory.ts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/library/select.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/library/table.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {AlertCircle, Search} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';
import {Input} from "@/components/library/input.tsx";
import {Button} from "@/components/library/button.tsx";
import {Label} from "@/components/core/label.tsx";


export function AdminLoanHistoryPage() {
    const {loans, loading, filter, setFilter, dateError, SEARCH_TYPES} = useAdminLoanHistory();

    // 가이드라인: 상태에 따른 배지 생성 (정석적인 매핑 방법)
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

        return (
            <Badge variant={variants[status] ?? 'default'}>
                {labels[status] ?? status}
            </Badge>
        );
    };

    // 가이드라인: 핸들러에서 any 제거 및 명시적 if/else 사용 (필요 시 확장)
    const handleSearchTypeChange = (value: typeof filter.searchType) => {
        setFilter({
            ...filter,
            searchType: value,
            page: 0
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof typeof filter) => {
        setFilter({
            ...filter,
            [field]: e.target.value,
            page: 0
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">대출 기록 조회</h1>
                <p className="text-sm text-zinc-500 mt-1">유저별, 도서별 대출 기록을 조회합니다</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>검색 조건</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>검색 유형</Label>
                            <Select
                                value={filter.searchType}
                                onValueChange={handleSearchTypeChange}
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

                        <div className="space-y-2">
                            <Label>검색어</Label>
                            <Input
                                placeholder="검색어 입력..."
                                value={filter.keyword}
                                onChange={(e) => handleInputChange(e, 'keyword')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>시작일</Label>
                            <Input
                                type="date"
                                value={filter.startDate}
                                onChange={(e) => handleInputChange(e, 'startDate')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>종료일</Label>
                            <Input
                                type="date"
                                value={filter.endDate}
                                onChange={(e) => handleInputChange(e, 'endDate')}
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
                            <TableRow className="border-b border-slate-100 pb-4">
                                <TableHead className="px-4">대출번호</TableHead>
                                <TableHead>사용자</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>대출일</TableHead>
                                <TableHead>반납예정일</TableHead>
                                <TableHead>반납일</TableHead>
                                <TableHead>대출권수</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="border-b border-slate-100 pb-4">
                                    <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                                        로딩 중...
                                    </TableCell>
                                </TableRow>
                            ) : (loans?.content?.length ?? 0) === 0 ? (
                                <TableRow className="border-b border-slate-100 pb-4">
                                    <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                                        조회된 대출 기록이 없습니다
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loans.content.map((loan) => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-mono text-xs">#{loan.id}</TableCell>
                                        <TableCell className="font-medium">{loan.userName}</TableCell>
                                        <TableCell>{loan.userEmail}</TableCell>
                                        <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {loan.returnDate
                                                ? new Date(loan.returnDate).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{loan.totalItems}권</TableCell>
                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {(loans?.totalPages ?? 0) > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        disabled={filter.page === 0}
                        onClick={() => setFilter({...filter, page: filter.page - 1})}
                    >
                        이전
                    </Button>
                    <div className="flex items-center px-4 text-sm font-medium">
                        {filter.page + 1} / {loans.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={filter.page >= (loans?.totalPages ?? 0) - 1}
                        onClick={() => setFilter({...filter, page: filter.page + 1})}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}