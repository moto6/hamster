// @/app/tab/TabContainer.tsx

import {cn} from "@/core/utils.ts";
import {useTab} from "@/app/tab/tabs.ts";

export function TabContainer() {
    const {tabs, activeTabId} = useTab();

    return (
        <div className="relative flex-1 w-full h-full overflow-hidden">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={cn(
                        "absolute inset-0 w-full h-full overflow-y-auto bg-background p-6",
                        tab.id === activeTabId ? "visible z-10 opacity-100" : "invisible z-0 opacity-0 pointer-events-none"
                    )}
                >
                    {tab.element}
                </div>
            ))}
        </div>
    );
}