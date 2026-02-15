// @/app/tab/TabBar.tsx

import {X} from "lucide-react";
import {cn} from "@/core/utils.ts";
import {useTab} from "@/app/tab/tabs.ts";

export function TabBar() {
    const {tabs, activeTabId, setActiveTab, closeTab} = useTab();

    return (
        <div
            className="flex items-center gap-1 px-4 bg-white border-b border-border h-10 overflow-x-auto no-scrollbar shrink-0">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "group flex items-center gap-2 px-3 h-8 min-w-[120px] rounded-t-md cursor-pointer text-sm transition-all border-x border-t border-transparent",
                        activeTabId === tab.id ? "bg-background border-border text-primary font-medium" : "text-muted-foreground hover:bg-slate-50"
                    )}
                >
                    <span className="truncate flex-1 text-xs">{tab.label}</span>
                    {tab.closable !== false && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                            className="p-0.5 rounded-full hover:bg-slate-200 text-muted-foreground transition-colors"
                        >
                            <X size={14} strokeWidth={2}/>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}