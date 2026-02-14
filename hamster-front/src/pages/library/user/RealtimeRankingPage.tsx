import {useRealtimeRanking} from './useRealtimeRanking.ts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/library/select.tsx';
import {Card, CardContent} from '@/components/library/card.tsx';
import {ArrowDown, ArrowUp, Minus, Star, TrendingUp} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';

export function RealtimeRankingPage() {
    const {rankings, loading, period, setPeriod, RANKING_PERIODS} = useRealtimeRanking();

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <Badge className="bg-yellow-500">1위</Badge>;
        if (rank === 2) return <Badge className="bg-slate-400">2위</Badge>;
        if (rank === 3) return <Badge className="bg-amber-700">3위</Badge>;
        return <Badge variant="outline">{rank}위</Badge>;
    };

    const getRankChangeIcon = (change?: number) => {
        if (!change || change === 0) {
            return <Minus className="size-4 text-slate-400"/>;
        }
        if (change > 0) {
            return (
                <div className="flex items-center gap-1 text-red-600">
                    <ArrowUp className="size-4"/>
                    <span className="text-xs">{change}</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-blue-600">
                <ArrowDown className="size-4"/>
                <span className="text-xs">{Math.abs(change)}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TrendingUp className="size-8 text-red-500"/>
                    <div>
                        <h1>실시간 랭킹</h1>
                        <p className="text-sm text-slate-500 mt-1">최근 평점 등록이 많은 도서</p>
                    </div>
                </div>

                <div className="w-48">
                    <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
                        <SelectTrigger>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {RANKING_PERIODS.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="py-12 text-center text-slate-500">
                        로딩 중...
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {rankings.map((book,) => (
                        <Card key={book.bookSkuId} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Rank */}
                                    <div className="flex flex-col items-center gap-2 w-20">
                                        {getRankBadge(book.rank)}
                                        {getRankChangeIcon(book.ratingCountChange)}
                                    </div>

                                    {/* Book Image */}
                                    <div
                                        className="w-24 h-32 bg-slate-100 rounded flex-shrink-0 flex items-center justify-center">
                                        {book.coverImageUrl ? (
                                            <img
                                                src={book.coverImageUrl}
                                                alt={book.title}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-slate-400 text-xs">표지없음</span>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{book.author}</p>
                                        <p className="text-sm text-slate-500 mb-3">{book.publisher}</p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="size-4 fill-yellow-400 text-yellow-400"/>
                                                <span className="text-sm font-medium">
                                                    {book.averageRating ? book.averageRating.toFixed(1) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                평점 등록 수: <span className="font-semibold text-blue-600">
                                                {book.ratingCount}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(rankings?.length ?? 0) === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-slate-500">
                                랭킹 데이터가 없습니다
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
