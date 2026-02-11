// @/app/tab/tabs.ts
import {create} from 'zustand'
import type {ReactNode} from "react";

type Tab = {
    key: string
    path: string
    title: string
    element: ReactNode
}

type State = {
    tabs: Tab[]
    activeKey: string
    openTab: (tab: Tab) => void
    closeTab: (key: string) => void
    setActive: (key: string) => void
}

export const useAdminTabs = create<State>((set) => ({
    tabs: [],
    activeKey: '',

    openTab(tab) {
        set(state => {
            const exists = state.tabs.find(t => t.key === tab.key)
            if (exists) return {activeKey: tab.key}
            return {
                tabs: [...state.tabs, tab],
                activeKey: tab.key,
            }
        })
    },

    closeTab(key) {
        set(state => {
            const tabs = state.tabs.filter(t => t.key !== key)
            const activeKey =
                state.activeKey === key && tabs.length
                    ? tabs[tabs.length - 1].key
                    : state.activeKey

            return {tabs, activeKey}
        })
    },

    setActive(key) {
        set({activeKey: key})
    },
}))
