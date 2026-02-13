import {Check, Clock, Search, X,} from 'lucide-react';
import {cn} from "@/core/utils";
import {Button} from '@/components/place/Button';
import {Input} from '@/components/place/Input';
import {Label} from '@/components/core/Label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/place/Select';
import {useReservationManagement} from './useReservationManagement';
import {useState} from "react";

export default function ReservationManagementPage() {
    const {data, isLoading, updateStatus} = useReservationManagement();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    if (isLoading) return <div className="p-10 text-slate-400 animate-pulse font-sans">데이터를 불러오는 중...</div>;

    const filteredData = data.filter(item => {
        const matchesSearch = item.roomName.includes(searchTerm) || item.userName.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || item.reservationStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const startHourOptions = Array.from({ length: 13 }, (_, i) => {
        const h = i + 8
        return h.toString().padStart(2, '0') + ':00'
    })

    const statusMap = {
        BOOKED: {
            class: "bg-slate-900 text-white",
            text: "예약됨"
        },
        CHECKED_IN: {
            class: "bg-amber-400 text-amber-950",
            text: "입실"
        },
        CANCELLED: {
            class: "bg-slate-100 text-slate-400",
            text: "취소"
        },
        NO_SHOW: {
            class: "bg-rose-100 text-rose-600",
            text: "노쇼"
        },
        CHECKED_OUT: {
            class: "bg-slate-200 text-slate-600",
            text: "퇴실"
        }
    } as const

    return (
        <div className="space-y-8 font-sans tracking-tight">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">예약 관리</h1>
                <p className="text-slate-500 mt-1">회의실 예약 내역을 실시간으로 확인하고 상태를 변경합니다.</p>
            </header>

            {/* Filters */}
            <div
                className="grid grid-cols-1 md:flex gap-4 items-end bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="search">회의실</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <Input
                            id="search"
                            className="pl-10"
                            placeholder="회의실 입력"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="search">예약자 검색</Label>
                    <Input
                        id="search"
                        className="pl-10"
                        placeholder="이메일 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 space-y-1.5">
                    <Label>시작 시간 선택</Label>

                    <Select value={searchTerm} onValueChange={setSearchTerm}>
                        <SelectTrigger>
                            <SelectValue placeholder="시작시간 선택" />
                        </SelectTrigger>

                        <SelectContent>
                            {startHourOptions.map(hour => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-48 space-y-1.5">
                    <Label>상태 필터</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 상태</SelectItem>
                            <SelectItem value="confirmed">확정</SelectItem>
                            <SelectItem value="pending">대기</SelectItem>
                            <SelectItem value="cancelled">취소</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">예약 정보</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">회의실</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">이용 시간</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">예약 상태</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">작업</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredData.map((res) => (
                        <tr key={res.reservationId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{res.userName}</div>
                                <div className="text-xs text-slate-400">{res.userEmail}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{res.roomName}</td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-bold text-slate-900">{res.date}</div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                    <Clock size={12}/> {res.startTime} - {res.endTime}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                    <span
                                        className={cn("px-2.5 py-1 rounded-lg text-[11px] font-bold", statusMap[res.reservationStatus].class)}>
                                        {statusMap[res.reservationStatus].text}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {res.reservationStatus === 'BOOKED' && (
                                        <>
                                            <Button size="sm" variant="outline"
                                                    className="h-8 w-8 p-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                    onClick={() => updateStatus(res.reservationId, 'CHECKED_IN')}><Check
                                                size={14}/></Button>
                                            <Button size="sm" variant="outline"
                                                    className="h-8 w-8 p-0 border-rose-200 text-rose-600 hover:bg-rose-50"
                                                    onClick={() => updateStatus(res.reservationId, 'CANCELLED')}><X
                                                size={14}/></Button>
                                        </>
                                    )}
                                    {res.reservationStatus === 'CHECKED_IN' && (
                                        <Button size="sm" variant="ghost" className="h-8 text-rose-500 hover:bg-rose-50"
                                                onClick={() => updateStatus(res.reservationId, 'CANCELLED')}>예약
                                            취소</Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredData.length === 0 &&
                    <div className="p-20 text-center text-slate-400 text-sm">일치하는 예약 내역이 없습니다.</div>}
            </div>
        </div>
    );
}