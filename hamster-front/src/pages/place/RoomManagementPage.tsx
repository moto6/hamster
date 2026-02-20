import React, {useState} from "react";
import {Building2, Check, Edit2, MapPin, Plus, Trash2, Users, X} from "lucide-react";
import {cn} from "@/core/utils";
import {Button} from "@/components/place/Button";
import {Input} from "@/components/place/Input";
import {Label} from "@/components/core/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/place/Select";
import {type Room, useRoomManagement} from "@/pages/place/useRoomManagement.ts";
import type {Resource} from "@/pages/place/uesResourceManagement.ts";


export function RoomManagementPage() {
    const {
        rooms,
        buildings,
        availableResources,
        isLoading,
        addRoom,
        updateRoom,
        deleteRoom,
    } = useRoomManagement();

    const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const [formData, setFormData] = useState({
        buildingId: "",
        name: "",
        floor: "",
        capacity: "",
        resources: [] as string[],
        roomAvailable: true,
    });

    if (isLoading) return <div className="p-10 text-slate-400 font-sans animate-pulse">회의실 데이터를 불러오는 중...</div>;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const buildingName = buildings.find(b => b.id === formData.buildingId)?.name ?? "";
        const newRoom: Room = {
            roomId: editingRoom?.roomId ?? Date.now().toString(),
            buildingId: formData.buildingId,
            buildingName,
            roomName: formData.name,
            roomFloor: formData.floor,
            capacity: Number(formData.capacity),
            resourceIds: formData.resources,
            roomAvailable: formData.roomAvailable,
            roomFloorMap: "",
            roomLocationNote: "",
        };

        if (editingRoom) {
            updateRoom(newRoom);
        } else {
            addRoom(newRoom);
        }

        setIsModalOpen(false);
    };

    const toggleResource = (id: string) => {
        setFormData(prev => ({
            ...prev,
            resources: prev.resources.includes(id)
                ? prev.resources.filter(r => r !== id)
                : [...prev.resources, id],
        }));
    };

    // 필터링 및 그룹화 로직
    const filteredRooms = rooms.filter(r => selectedBuilding === "all" || r.buildingId === selectedBuilding);
    const groupedRooms = filteredRooms.reduce((acc, room) => {
        acc[room.buildingName] = [...(acc[room.buildingName] || []), room];
        return acc;
    }, {} as Record<string, Room[]>);

    const groupedResources = availableResources.reduce((acc, res) => {
        acc[res.category] = [...(acc[res.category] || []), res];
        return acc;
    }, {} as Record<string, Resource[]>);

    return (
        <div className="space-y-8 font-sans tracking-tight">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">회의실 관리</h1>
                    <p className="text-slate-500 mt-1">건물별 회의실 가용 상태와 보유 장비를 관리합니다.</p>
                </div>
                <Button onClick={() => {
                    setEditingRoom(null);
                    setFormData({ buildingId: buildings[0]?.id ?? "", name: "", floor: "", capacity: "", resources: [], roomAvailable: true });
                    setIsModalOpen(true);
                }} className="gap-2">
                    <Plus size={18} /> 회의실 추가
                </Button>
            </header>

            {/* Building Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 max-w-sm">
                <Building2 size={20} className="text-slate-400 shrink-0" />
                <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 px-0 h-auto">
                        <SelectValue placeholder="전체 건물" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 건물</SelectItem>
                        {buildings.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Room Grid grouped by Building */}
            {Object.entries(groupedRooms).map(([buildingName, buildingRooms]) => (
                <div key={buildingName} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-800">{buildingName}</h3>
                        <span className="text-xs font-medium text-slate-400">({buildingRooms.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {buildingRooms.map((room) => (
                            <div key={room.roomId} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900">{room.roomName}</h4>
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold mt-1.5",
                                            room.roomAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                                        )}>
                      {room.roomAvailable ? "사용 가능" : "점검 중"}
                    </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {
                                            setEditingRoom(room);
                                            setFormData({ buildingId: room.buildingId, name: room.roomName, floor: room.roomFloor, capacity: room.capacity.toString(), resources: room.resourceIds, roomAvailable: room.roomAvailable });
                                            setIsModalOpen(true);
                                        }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"><Edit2 size={16}/></button>
                                        <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteRoom(room.roomId); }} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-sm text-slate-500"><Users size={16}/> 최대 {room.capacity}명</div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16}/> {room.roomFloor}</div>
                                    <div className="pt-3 border-t border-slate-50 flex flex-wrap gap-1.5">
                                        {room.resourceIds.length > 0 ? room.resourceIds.map(rid => (
                                            <span key={rid} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-medium">
                        {availableResources.find(r => r.id === rid)?.name}
                      </span>
                                        )) : <span className="text-xs text-slate-300 italic">보유 리소스 없음</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Modal Section */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">{editingRoom ? '회의실 정보 수정' : '신규 회의실 등록'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>건물 선택</Label>
                                    <Select value={formData.buildingId} onValueChange={v => setFormData({...formData, buildingId: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{buildings.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="roomName">회의실 이름</Label>
                                    <Input id="roomName" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="floor">위치 (층)</Label>
                                    <Input id="floor" value={formData.floor} required onChange={e => setFormData({...formData, floor: e.target.value})} placeholder="예: 3층" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="capacity">최대 수용 인원</Label>
                                    <Input id="capacity" type="number" value={formData.capacity} required onChange={e => setFormData({...formData, capacity: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>가용 상태</Label>
                                <Select value={formData.roomAvailable ? "true" : "false"} onValueChange={v => setFormData({...formData, roomAvailable: v === "true"})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">사용 가능</SelectItem>
                                        <SelectItem value="false">점검 중</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label>보유 리소스 선택</Label>
                                <div className="border border-slate-200 rounded-xl p-4 space-y-4 max-h-60 overflow-y-auto bg-slate-50/30">
                                    {Object.entries(groupedResources).map(([cat, res]) => (
                                        <div key={cat} className="space-y-2">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{cat}</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {res.map(r => (
                                                    <button type="button" key={r.id} onClick={() => toggleResource(r.id)}
                                                            className={cn(
                                                                "flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer",
                                                                formData.resources.includes(r.id) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                                            )}>
                                                        {formData.resources.includes(r.id) ? <Check size={14}/> : <div className="size-3.5 rounded border border-slate-300 bg-white" />}
                                                        <span className="text-xs font-medium">{r.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>취소</Button>
                                <Button type="submit" className="flex-1">저장하기</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}