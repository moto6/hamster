// @/app/tab/tabs.ts
import { createContext, useContext, type ReactNode } from "react";

export type TabId = string;

export type TabItem = {
    id: TabId;
    label: string;
    path: string;
    element: ReactNode;
    closable?: boolean;
};

export type TabState = {
    activeTabId: TabId;
    tabs: TabItem[];
};

export type TabContextType = TabState & {
    openTab: (item: TabItem) => void;
    closeTab: (id: TabId) => void;
    setActiveTab: (id: TabId) => void;
};

// --- Context & Hook ---
// Context를 여기서 생성하여 순환 참조와 HMR 이슈 방지
export const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTab = () => {
    const context = useContext(TabContext);
    if (!context) throw new Error("useTab must be used within a TabProvider");
    return context;
};