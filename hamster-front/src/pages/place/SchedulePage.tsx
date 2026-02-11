import {Building2, Calendar, ChevronLeft, ChevronRight, Clock} from 'lucide-react';
import {cn} from "@/core/utils";
import {Button} from '@/components/place/Button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/place/Select';
import type {Room} from "@/pages/place/useRoomManagement.ts";
import {type ReservationStatus, useSchedule} from "@/pages/place/useSchedule.ts";

export function SchedulePage() {
    const {
        selectedDate, selectedBuilding, setSelectedBuilding,
        buildings, rooms, reservations, timeSlots,
        changeDate, goToToday, getReservationStyle
    } = useSchedule();

    // 헬퍼 함수: 날짜 포맷
    //const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const getDateLabel = (date: Date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
    };

    const statusMap: Record<ReservationStatus, string> = {
        BOOKED: 'bg-slate-900 text-white border-slate-900',
        CHECKED_IN: 'bg-amber-400 text-amber-950 border-amber-400',
        CANCELLED: 'bg-amber-400 text-amber-950 border-amber-400',
        NO_SHOW: 'bg-slate-100 text-slate-400 border-slate-200',
        CHECKED_OUT: 'bg-slate-100 text-slate-400 border-slate-200'
    };

    // 필터링 및 그룹화
    const filteredRooms = rooms.filter(r => selectedBuilding === 'all' || r.buildingId === selectedBuilding);
    const groupedRooms = filteredRooms.reduce((acc, room) => {
        acc[room.buildingName] = [...(acc[room.buildingName] || []), room];
        return acc;
    }, {} as Record<string, Room[]>);

    return (
        <div className="overflow-x-auto">
            <div className="space-y-6 font-sans tracking-tight pb-20 min-w-[1200px]">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">회의실 일정표</h1>
                    <p className="text-slate-500 mt-1">실시간 예약 현황을 타임라인으로 관리합니다.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(-1)}><ChevronLeft
                        size={16}/></Button>
                    <div className="px-3 flex items-center gap-2 border-x border-slate-100">
                        <Calendar size={14} className="text-slate-400"/>
                        <span className="text-sm font-bold text-slate-700">{getDateLabel(selectedDate)}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(1)}><ChevronRight
                        size={16}/></Button>
                    <Button variant="secondary" size="sm" className="ml-2 h-8 text-[11px]"
                            onClick={goToToday}>오늘</Button>
                </div>
            </header>

            {/* Top Filter Bar */}
            <div
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 max-w-sm">
                <Building2 size={18} className="text-slate-400 shrink-0"/>
                <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 h-auto p-0">
                        <SelectValue placeholder="건물 선택"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 건물 보기</SelectItem>
                        {buildings.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Timeline Boards */}
            {Object.entries(groupedRooms).map(([buildingName, buildingRooms]) => (
                <section key={buildingName} className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Building2 size={16}/>
                        <h3 className="text-sm font-bold uppercase tracking-wider">{buildingName}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                {/* Timeline Header */}
                                <div className="flex border-b border-slate-100 bg-slate-50/50">
                                    <div
                                        className="w-56 p-4 border-r border-slate-100 text-xs font-bold text-slate-400">회의실
                                        정보
                                    </div>
                                    <div className="flex-1 flex">
                                        {timeSlots.map(slot => (
                                            <div key={slot.hour}
                                                 className="flex-1 p-3 text-center text-[10px] font-bold text-slate-400 border-r border-slate-100/50 last:border-0">
                                                {slot.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Room Rows */}
                                {buildingRooms.map(room => {
                                    const roomRes = reservations.filter(res => res.roomId === room.roomId);
                                    return (
                                        <div key={room.roomId}
                                             className="flex border-b border-slate-100 last:border-0 group min-h-[68px]">
                                            <div
                                                className="w-56 p-4 border-r border-slate-100 bg-white group-hover:bg-slate-50 transition-colors">
                                                <div className="font-bold text-slate-900 text-sm">{room.roomName}</div>
                                                <div
                                                    className="text-[11px] text-slate-400 mt-0.5">{room.roomLocationNote}</div>
                                            </div>

                                            <div className="flex-1 relative h-20">
                                                {/* Background Grid */}
                                                <div className="absolute inset-0 flex">
                                                    {timeSlots.map((_, idx) => (
                                                        <div key={idx}
                                                             className={cn("flex-1 border-r border-slate-100/30 last:border-0", idx % 2 === 0 ? "bg-slate-50/20" : "bg-white")}/>
                                                    ))}
                                                </div>

                                                {/* Reservation Blocks */}
                                                {roomRes.map(res => (
                                                    <div
                                                        key={res.reservationId}
                                                        style={getReservationStyle(res.startTime, res.endTime)}
                                                        className={cn(
                                                            "absolute top-1/2 -translate-y-1/2 rounded-xl border p-2 min-w-[60px] min-h-[68px] shadow-sm transition-all hover:scale-[1.02] hover:z-10 cursor-pointer overflow-hidden flex flex-col justify-center",
                                                            statusMap[res.reservationStatus]
                                                        )}
                                                    >
                                                        <div
                                                            className="font-bold text-[11px] truncate">{res.purpose}</div>
                                                        <div
                                                            className="text-[9px] opacity-80 flex items-center gap-1 mt-0.5">
                                                            <Clock size={8}/> {res.startTime} - {res.endTime}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Legend */}
            <footer className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <div className="size-2.5 rounded-full bg-slate-900"/>
                    확정
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <div className="size-2.5 rounded-full bg-amber-400"/>
                    대기
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <div className="size-2.5 rounded-full bg-slate-100 border border-slate-200"/>
                    취소
                </div>
            </footer>
        </div>
        </div>
    );
}