import React, { useState } from 'react';
import { Building2, Edit2, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useBuildingList, type Building } from './useBuildingList';

export default function BuildingListPage() {
    const { data, isLoading, error, addBuilding, updateBuilding, deleteBuilding } = useBuildingList();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', floors: '' });

    if (isLoading) return <div className="p-10 text-slate-400 font-medium font-sans">데이터 로딩 중...</div>;
    if (error) return <div className="p-10 text-rose-500 font-medium font-sans">{error}</div>;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newBuilding: Building = {
            id: editingBuilding ? editingBuilding.id : Date.now().toString(),
            name: formData.name,
            address: formData.address,
            floors: parseInt(formData.floors, 10),
            roomCount: editingBuilding ? editingBuilding.roomCount : 0,
            // 불리언 값을 정석적으로 할당 (신규는 true 기본값)
            buildingAvailable: editingBuilding ? editingBuilding.buildingAvailable : true
        };

        if (editingBuilding) {
            updateBuilding(newBuilding);
        } else {
            addBuilding(newBuilding);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8 font-sans tracking-tight">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">건물 관리</h1>
                    <p className="text-slate-500 mt-1">등록된 건물의 상세 정보와 시설 현황을 관리합니다.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingBuilding(null);
                        setFormData({ name: '', address: '', floors: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium shadow-sm cursor-pointer"
                >
                    <Plus size={18} /> 건물 추가
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((building) => (
                    <div key={building.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{building.name}</h3>
                                    {/* boolean 값에 따른 정석적인 분기 처리 */}
                                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[11px] font-bold mt-1 ${
                                        building.buildingAvailable
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-50 text-slate-400'
                                    }`}>
                                        {building.buildingAvailable ? '운영 중' : '운영 중지'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setEditingBuilding(building);
                                        setFormData({
                                            name: building.name,
                                            address: building.address,
                                            floors: building.floors.toString()
                                        });
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => { if (confirm('해당 건물을 삭제하시겠습니까?')) deleteBuilding(building.id); }}
                                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-2 text-slate-500 text-sm">
                                <MapPin size={16} className="mt-0.5 shrink-0" />
                                <span className="leading-snug">{building.address}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">전체 층수</p>
                                    <p className="text-lg font-bold text-slate-800">{building.floors}F</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">회의실 수</p>
                                    <p className="text-lg font-bold text-slate-800">{building.roomCount}개</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">{editingBuilding ? '건물 정보 수정' : '새 건물 등록'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">건물명</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    required
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">주소</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    required
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">층수</label>
                                <input
                                    type="number"
                                    value={formData.floors}
                                    required
                                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                                >
                                    저장하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}