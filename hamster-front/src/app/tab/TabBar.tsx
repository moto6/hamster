// @/app/tab/TabBar.tsx
import {X} from "lucide-react";
import {cn} from "@/core/utils.ts";
import {useTab} from "@/app/tab/tabs.ts";

export function TabBar() {
    const {tabs, activeTabId, setActiveTab, closeTab} = useTab();

    return (
        <div className="flex items-end gap-0.5 h-full overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        // 기본 스타일: Header 높이에 맞춤
                        "group flex items-center gap-2 px-3 h-[calc(100%-4px)] min-w-[100px] max-w-[180px] cursor-pointer text-xs transition-all relative",
                        "border-x border-slate-100",
                        activeTabId === tab.id
                            ? "bg-slate-50 text-[#0176d3] font-bold border-x-slate-200"
                            : "text-slate-500 hover:bg-slate-50 opacity-80"
                    )}
                >
                    {/* 세일즈포스 스타일 상단 하이라이트 바 */}
                    {activeTabId === tab.id && (
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0176d3]"/>
                    )}

                    <span className="truncate flex-1">{tab.label}</span>

                    {tab.closable !== false && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                            className="p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={12} strokeWidth={2.5}/>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}