import { Button } from '@/components/place/Button';
import { Label } from '@/components/place/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/place/Select';
import { RadioGroup, RadioGroupItem } from '@/components/place/RadioGroup';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/place/Popover';
import { usePlayground2 } from '@/pages/usePlayground2.ts';
import { Settings, Info, Bell, Monitor, Sun, Moon } from 'lucide-react';

export default function ComponentPlaygroundPage2() {
    const {
        buildingStatus, setBuildingStatus,
        themeMode, setThemeMode,
        isSaving, handleSave
    } = usePlayground2();

    return (
        <div className="space-y-12 font-sans tracking-tight p-8 pb-32">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">UI Playground: Group 2</h1>
                <p className="text-slate-500 mt-1">Select, RadioGroup, Popover의 정석적인 구현을 검증합니다.</p>
            </header>

            {/* --- Select Section --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">04. Select (Dropdown)</h2>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-2">
                        <Label>건물 운영 상태</Label>
                        <Select value={buildingStatus} onValueChange={setBuildingStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="상태를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="operating">정상 운영</SelectItem>
                                <SelectItem value="maintenance">정기 점검</SelectItem>
                                <SelectItem value="emergency">긴급 폐쇄</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 mt-2">
                            선택된 시스템 코드: <span className="font-bold text-slate-900">{buildingStatus || 'none'}</span>
                        </p>
                    </div>

                    <div className="space-y-2 opacity-50">
                        <Label>비활성화된 셀렉트</Label>
                        <Select disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="수정 권한 없음" />
                            </SelectTrigger>
                            <SelectContent />
                        </Select>
                    </div>
                </div>
            </section>

            {/* --- Radio Group Section --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">05. Radio Group</h2>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl">
                    <Label className="mb-4 block">대시보드 테마 설정</Label>
                    <RadioGroup value={themeMode} onValueChange={setThemeMode} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <RadioGroupItem value="light" id="theme-light" />
                            <Label htmlFor="theme-light" className="mb-0 ml-0 cursor-pointer flex items-center gap-2">
                                <Sun size={16} className="text-amber-500" /> 라이트 모드
                            </Label>
                        </div>
                        <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <RadioGroupItem value="dark" id="theme-dark" />
                            <Label htmlFor="theme-dark" className="mb-0 ml-0 cursor-pointer flex items-center gap-2">
                                <Moon size={16} className="text-indigo-500" /> 다크 모드
                            </Label>
                        </div>
                        <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <RadioGroupItem value="system" id="theme-system" />
                            <Label htmlFor="theme-system" className="mb-0 ml-0 cursor-pointer flex items-center gap-2">
                                <Monitor size={16} className="text-slate-500" /> 시스템 설정
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </section>

            {/* --- Popover Section --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">06. Popover (Floating UI)</h2>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-wrap gap-4">
                    {/* 정보 제공형 Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Info size={14} /> 시스템 사양
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-64">
                            <div className="space-y-2">
                                <h4 className="font-bold text-sm">Server Info</h4>
                                <div className="text-xs text-slate-500 space-y-1">
                                    <p>• Version: v2.4.0-stable</p>
                                    <p>• Region: Seoul (ap-northeast-2)</p>
                                    <p>• Uptime: 99.9%</p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* 액션 제어형 Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="secondary" size="sm" className="gap-2">
                                <Settings size={14} /> 퀵 세팅
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Bell size={16} className="text-slate-400" />
                                    <span className="font-bold text-sm">알림 환경 설정</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">이메일 알림 수신</span>
                                        <div className="size-2 bg-emerald-500 rounded-full" />
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">브라우저 푸시</span>
                                        <div className="size-2 bg-slate-200 rounded-full" />
                                    </div>
                                </div>
                                <Button className="w-full" size="sm" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? "저장 중..." : "설정 반영하기"}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </section>
        </div>
    );
}