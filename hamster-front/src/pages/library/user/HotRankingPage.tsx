import {useHotRanking} from './useHotRanking.ts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/library/card.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/library/select.tsx';
import {Label} from '@/components/core/label.tsx';
import {Award, Star, TrendingUp} from 'lucide-react';
import {Badge} from '@/components/library/badge.tsx';
import {
    AGE_GROUPS,
    type AgeGroup,
    type Gender,
    GENDERS,
    type Region,
    REGIONS,
    type Subject,
    SUBJECTS
} from "@/pages/library/libraryTypes.ts";

export function HotRankingPage() {
    const {rankings, loading, filters, setFilters} = useHotRanking();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1>핫 랭킹 추천</h1>
                    <p className="text-sm text-slate-500 mt-1">평점과 인기를 결합한 맞춤형 도서 추천</p>
                </div>
                <Badge variant="outline" className="text-sm">
                    <TrendingUp className="size-3 mr-1"/>
                    실시간 업데이트
                </Badge>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>맞춤 필터</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>성별</Label>
                            <Select
                                value={filters.gender}
                                onValueChange={(value: Gender) => setFilters({...filters, gender: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {GENDERS.map((gender) => (
                                        <SelectItem key={gender} value={gender}>
                                            {gender}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>연령</Label>
                            <Select
                                value={filters.ageGroup}
                                onValueChange={(value: AgeGroup) => setFilters({...filters, ageGroup: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {AGE_GROUPS.map((age) => (
                                        <SelectItem key={age} value={age}>
                                            {age}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>지역</Label>
                            <Select
                                value={filters.region}
                                onValueChange={(value: Region) => setFilters({...filters, region: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {REGIONS.map((region) => (
                                        <SelectItem key={region} value={region}>
                                            {region}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>주제</Label>
                            <Select
                                value={filters.subject}
                                onValueChange={(value: Subject) => setFilters({...filters, subject: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map((subject) => (
                                        <SelectItem key={subject} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rankings Grid */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">
                    로딩 중...
                </div>
            ) : (
                <div className="grid gap-4">
                    {rankings.map((book) => (
                        <Card key={book.bookSkuId} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex gap-6">
                                    {/* Rank Badge */}
                                    <div className="flex items-center justify-center">
                                        {book.rank <= 3 ? (
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                                                book.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                    book.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                        'bg-orange-100 text-orange-700'
                                            }`}>
                                                <Award className="size-6"/>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold">
                                                {book.rank}
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Cover */}
                                    <div className="shrink-0">
                                        {book.coverImageUrl ? (
                                            <img
                                                src={book.coverImageUrl}
                                                alt={book.title}
                                                className="w-24 h-32 object-cover rounded shadow-sm"
                                            />
                                        ) : (
                                            <div
                                                className="w-24 h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{book.author} · {book.publisher}</p>
                                        <p className="text-xs text-slate-500 font-mono mb-3">ISBN: {book.isbn}</p>

                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex items-center gap-1">
                                                <Star className="size-4 fill-yellow-400 text-yellow-400"/>
                                                <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                                                <span className="text-sm text-slate-500">({book.totalRatings}개)</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    <TrendingUp className="size-3 mr-1"/>
                                                    핫 스코어: {book.hotScore.toFixed(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {(rankings?.length ?? 0) === 0 && !loading && (
                <Card>
                    <CardContent className="py-12 text-center text-slate-500">
                        선택한 조건에 맞는 도서가 없습니다.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
