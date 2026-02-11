// @/app/gnb/config/navigation.config.tsx

import type {ReactNode} from "react";
import {DashboardPage} from "@/pages/admin/DashboardPage.tsx";
import {UserPage} from "@/pages/admin/DemoPage.tsx";
import {MyAdminPage} from "@/pages/admin/MyAdminPage.tsx";
import {PlaceDashboardPage} from "@/pages/place/PlaceDashboardPage.tsx";
import BuildingManagementPage from "@/pages/place/BuildingManagementPage.tsx";
import ComponentPlaygroundPage1 from "@/pages/ComponentPlaygroundPage1.tsx";
import ComponentPlaygroundPage2 from "@/pages/ComponentPlaygroundPage2.tsx";

import ReservationManagementPage from "@/pages/place/ReservationManagementPage.tsx";
import ResourceManagementPage from "@/pages/place/ResourceManagementPage.tsx";
import RoomManagementPage from "@/pages/place/RoomManagementPage.tsx";
import {SchedulePage} from "@/pages/place/SchedulePage.tsx";

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
    {
        label: 'BuildingManagement',
        path: '/buildings',
        element: <BuildingManagementPage/>,
        category: "PLACE"
    },
    {
        label: 'ReservationManagementPage',
        path: '/ReservationManagementPage',
        element: <ReservationManagementPage/>,
        category: "PLACE"
    },
    {
        label: 'ResourceManagementPage',
        path: '/ResourceManagementPage',
        element: <ResourceManagementPage/>,
        category: "PLACE"
    },
    {
        label: 'RoomManagementPage',
        path: '/RoomManagementPage',
        element: <RoomManagementPage/>,
        category: "PLACE"
    },
    {
        label: 'SchedulePage',
        path: '/SchedulePage',
        element: <SchedulePage/>,
        category: "PLACE"
    },
    /*
        {
            label: '',
            path: '/',
            element: </>,
            category: "PLACE"
        },
    */



    {
        label: 'TEST',
        path: '/playground1',
        element: <ComponentPlaygroundPage1/>,
    },
    {
        label: 'TEST2',
        path: '/playground2',
        element: <ComponentPlaygroundPage2/>,
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
