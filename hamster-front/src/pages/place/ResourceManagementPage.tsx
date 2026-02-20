import React, {useState} from 'react';
import {Edit2, Package, Plus, Trash2, X} from 'lucide-react';
import {cn} from "@/core/utils";
import {Button} from '@/components/place/Button';
import {Input} from '@/components/place/Input';
import {Label} from '@/components/core/label.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/place/Select';
import {
    type Resource,
    RESOURCE_CATEGORIES,
    type ResourceCategory,
    useResourceManagement
} from "@/pages/place/uesResourceManagement.ts";

export function ResourceManagementPage() {
    const {data, isLoading, addResource, updateResource, deleteResource} = useResourceManagement();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [formData, setFormData] = useState({name: '', category: '기타' as ResourceCategory, description: ''});
    const categories = RESOURCE_CATEGORIES
    const categoryStyles: Record<ResourceCategory, string> = {
        '디스플레이': 'bg-blue-50 text-blue-600',
        '필기도구': 'bg-emerald-50 text-emerald-600',
        '전자기기': 'bg-indigo-50 text-indigo-600',
        '음향장비': 'bg-amber-50 text-amber-600',
        '기타': 'bg-slate-50 text-slate-500',
    };

    if (isLoading) return <div className="p-10 text-slate-400 font-sans">리소스 로딩 중...</div>;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newResource: Resource = {
            id: editingResource?.id ?? Date.now().toString(),
            name: formData.name,
            category: formData.category,
            description: formData.description,
        };

        if (editingResource) {
            updateResource(newResource);
        } else {
            addResource(newResource);
        }
        setIsModalOpen(false);
    };

    const grouped = data.reduce((acc, r) => {
        acc[r.category] = [...(acc[r.category] || []), r];
        return acc;
    }, {} as Record<ResourceCategory, Resource[]>);

    return (
        <div className="space-y-8 font-sans tracking-tight">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">공간 리소스 관리</h1>
                    <p className="text-slate-500 mt-1">회의실에 배치될 공용 비품 및 장비를 체계적으로 관리합니다.</p>
                </div>
                <Button onClick={() => {
                    setEditingResource(null);
                    setFormData({name: '', category: '기타', description: ''});
                    setIsModalOpen(true);
                }} className="gap-2">
                    <Plus size={18}/> 리소스 추가
                </Button>
            </header>

            <div className="space-y-10">
                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Package size={18} className="text-slate-400"/>
                            <h3 className="font-bold text-slate-800">{category}</h3>
                            <span className="text-xs font-medium text-slate-400">({items.length})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {items.map((item) => (
                                <div key={item.id}
                                     className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                                            <span
                                                className={cn("inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold mt-1.5", categoryStyles[item.category])}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <div
                                            className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                setEditingResource(item);
                                                setFormData({
                                                    name: item.name,
                                                    category: item.category,
                                                    description: item.description
                                                });
                                                setIsModalOpen(true);
                                            }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Edit2
                                                size={14}/></button>
                                            <button onClick={() => {
                                                if (confirm('삭제할까요?')) deleteResource(item.id);
                                            }} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><Trash2
                                                size={14}/></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - React 19/Tailwind v4 정석 스타일 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">{editingResource ? '리소스 수정' : '신규 리소스 등록'}</h3>
                            <button onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">리소스 이름</Label>
                                <Input id="name" value={formData.name} required
                                       onChange={e => setFormData({...formData, name: e.target.value})}
                                       placeholder="예: 무선 마이크"/>
                            </div>
                            <div className="space-y-1.5">
                                <Label>카테고리</Label>
                                <Select value={formData.category}
                                        onValueChange={(val: ResourceCategory) => setFormData({
                                            ...formData,
                                            category: val
                                        })}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="desc">상세 설명</Label>
                                <textarea id="desc" value={formData.description} required
                                          onChange={e => setFormData({...formData, description: e.target.value})}
                                          className="w-full h-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm resize-none"/>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" className="flex-1"
                                        onClick={() => setIsModalOpen(false)}>취소</Button>
                                <Button type="submit" className="flex-1">저장하기</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}