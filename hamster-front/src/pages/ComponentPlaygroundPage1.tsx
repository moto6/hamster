import {Button} from '@/components/place/Button.tsx';
import {Input} from '@/components/place/Input.tsx';
import {Label} from '@/components/place/Label.tsx';
import {Loader2, Search, Send, Trash2} from 'lucide-react';
import {usePlayground} from "@/pages/usePlayground.ts";

export default function ComponentPlaygroundPage1() {
    const {inputValue, isLoading, handleInputChange, simulateLoading} = usePlayground();

    return (
        <div className="space-y-12 font-sans tracking-tight pb-20">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">UI Playground</h1>
                <p className="text-slate-500 mt-1">1그룹 컴포넌트(Button, Input, Label)의 정석적인 동작을 검증합니다.</p>
            </header>

            {/* --- Button Section --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">01. Buttons</h2>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl space-y-8">
                    {/* Variants */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-400">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="default">Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    {/* Sizes & Icons */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-400">Sizes & Icons</p>
                        <div className="flex flex-wrap items-end gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default (MD)</Button>
                            <Button size="lg">Large (XL)</Button>
                            <Button size="icon" variant="outline"><Search size={16}/></Button>
                            <Button className="gap-2">
                                {isLoading ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                                {isLoading ? "Sending..." : "With Icon"}
                            </Button>
                        </div>
                    </div>

                    {/* States */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-slate-400">Interactions</p>
                        <div className="flex flex-wrap gap-3">
                            <Button disabled>Disabled State</Button>
                            <Button onClick={simulateLoading}>Click to Simulate Loading</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Input & Label Section --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">02. Inputs & Labels</h2>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl space-y-8">
                    <div className="max-w-sm space-y-6">
                        {/* Default Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="admin@hamster.com"/>
                            <p className="text-[11px] text-slate-400 ml-1">우리가 만든 Label과 Input의 조합입니다.</p>
                        </div>

                        {/* Interactive Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="playground">Live Mirror</Label>
                            <Input
                                id="playground"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="글자를 입력해보세요..."
                            />
                            <p className="text-sm text-slate-600 ml-1">입력값: <span
                                className="font-bold text-slate-900">{inputValue || '없음'}</span></p>
                        </div>

                        {/* Disabled & Error States */}
                        <div className="space-y-1.5">
                            <Label className="text-rose-500">Error State Example</Label>
                            <Input
                                className="border-rose-200 focus-visible:ring-rose-500/10 focus-visible:border-rose-500"
                                placeholder="에러 스타일 강조"/>
                        </div>

                        <div className="space-y-1.5 opacity-50">
                            <Label>Disabled Input</Label>
                            <Input disabled placeholder="입력할 수 없습니다."/>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Combined Form Preview --- */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">03. Real World Preview</h2>
                <div className="p-8 bg-slate-900 rounded-2xl shadow-xl max-w-md mx-auto">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div
                                className="size-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                <Trash2 size={24}/>
                            </div>
                            <h3 className="text-white font-bold text-lg">데이터 삭제 확인</h3>
                            <p className="text-slate-400 text-sm">정말로 해당 건물을 삭제하시겠습니까?</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost"
                                    className="flex-1 text-white hover:bg-white/10 hover:text-white">취소</Button>
                            <Button variant="destructive" className="flex-1">삭제하기</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}