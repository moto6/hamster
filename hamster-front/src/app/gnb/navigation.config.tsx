// @/app/gnb/config/navigation.config.tsx

import type {ReactNode} from "react";
import {DashboardPage} from "@/pages/admin/DashboardPage.tsx";
import {UserPage} from "@/pages/admin/DemoPage.tsx";
import {MyAdminPage} from "@/pages/admin/MyAdminPage.tsx";
import {PlaceDashboardPage} from "@/pages/place/PlaceDashboardPage.tsx";

export type NavCategory = "ADMIN" | "USER" | "SYSTEM" | "PLACE"

interface NavGroup {
    category: NavCategory
    title: string
}

interface NavItem {
    path: string
    label: string
    element: ReactNode
    //
    category?: NavCategory
    //
    description?: string
    hidden?: boolean;
}

export const GNB_NAV_ITEMS: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/admin',
        element: <DashboardPage/>,
        category: "ADMIN"
    },
    {
        label: 'my admin',
        path: '/my-admin',
        element: <MyAdminPage/>,
        category: "ADMIN"
    },
    {
        label: 'Users',
        path: '/users',
        element: <UserPage/>,
        category: "USER"
    },
    {
        label: 'PlaceDashboard',
        path: '/place',
        element: <PlaceDashboardPage/>,
        category: "PLACE"
    },
]

export const GNB_NAV_GROUPS: NavGroup[] = [
    {
        category: "ADMIN",
        title: "🎯admin",
    },
    {
        category: "SYSTEM",
        title: "⚙️System",
    },
    {
        category: "USER",
        title: "👤 User"
    },
    {
        category: "PLACE",
        title: "PLACE"
    },
]
