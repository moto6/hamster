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
        label: '공간 현황',
        path: '/place/main',
        element: <PlaceDashboardPage/>,
        category: "PLACE"
    },
    {
        label: '건물 관리',
        path: '/place/buildings',
        element: <BuildingManagementPage/>,
        category: "PLACE"
    },
    {
        label: '예약 관리자 페이지',
        path: '/place/reservation',
        element: <ReservationManagementPage/>,
        category: "PLACE"
    },
    {
        label: '리소스 관리',
        path: '/place/resource',
        element: <ResourceManagementPage/>,
        category: "PLACE"
    },
    {
        label: '공간 관리',
        path: '/place/rooms',
        element: <RoomManagementPage/>,
        category: "PLACE"
    },
    {
        label: '(유저) 스케쥴 화면',
        path: '/place/schedules',
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
        title: "공간예약"
    },
]
