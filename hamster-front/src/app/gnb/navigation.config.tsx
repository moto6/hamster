// @/app/gnb/config/navigation.config.tsx

import type {ReactNode} from "react";

import {PlaceDashboardPage} from "@/pages/place/PlaceDashboardPage.tsx";
import BuildingManagementPage from "@/pages/place/BuildingManagementPage.tsx";

import ReservationManagementPage from "@/pages/place/ReservationManagementPage.tsx";
import ResourceManagementPage from "@/pages/place/ResourceManagementPage.tsx";
import RoomManagementPage from "@/pages/place/RoomManagementPage.tsx";
import {SchedulePage} from "@/pages/place/SchedulePage.tsx";
import {DashboardPage} from "@/pages/playground/DashboardPage.tsx";
import {MyAdminPage} from "@/pages/playground/MyAdminPage.tsx";
import {UserPage} from "@/pages/playground/DemoPage.tsx";
import {AdminLoanHistoryPage} from "@/pages/library/admin/AdminLoanHistoryPage.tsx";
import {AdminReservationPage} from "@/pages/library/admin/AdminReservationPage.tsx";
import {OverdueManagementPage} from "@/pages/library/admin/OverdueManagementPage.tsx";
import {BookRatingManagementPage} from "@/pages/library/admin/BookRatingManagementPage.tsx";
import {BookSkuManagementPage} from "@/pages/library/admin/BookSkuManagementPage.tsx";
import {RealtimeRankingPage} from "@/pages/library/user/RealtimeRankingPage.tsx";
import {MyReservationPage} from "@/pages/library/user/MyReservationPage.tsx";
import {MyLoanHistoryPage} from "@/pages/library/user/MyLoanHistoryPage.tsx";
import {HotRankingPage} from "@/pages/library/user/HotRankingPage.tsx";
import {BookSearchPage} from "@/pages/library/user/BookSearchPage.tsx";
import {BookRatingViewPage} from "@/pages/library/user/BookRatingViewPage.tsx";

export type NavCategory = "TEST" | "LIBRARY-USER" | "SYSTEM" | "PLACE" | "LIBRARY-ADMIN"

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
        category: "TEST"
    },
    {
        label: 'my admin',
        path: '/my-admin',
        element: <MyAdminPage/>,
        category: "TEST"
    },
    {
        label: 'Users',
        path: '/users',
        element: <UserPage/>,
        category: "TEST"
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
    {
        label: '대출정보',
        path: '/loansInfo',
        element: <AdminLoanHistoryPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '예약정보',
        path: '/library-admin/reservation',
        element: <AdminReservationPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '연체내역',
        path: '/library-admin/overdue',
        element: <OverdueManagementPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '책 인기랭킹',
        path: '/book-rating',
        element: <BookRatingManagementPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: 'SKU 관리',
        path: 'book-sku',
        element: <BookSkuManagementPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: 'RealtimeRankingPage',
        path: '/RealtimeRankingPage',
        element: <RealtimeRankingPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'MyReservationPage',
        path: 'MyReservationPage',
        element: <MyReservationPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'MyLoanHistoryPage',
        path: 'MyLoanHistoryPage',
        element: <MyLoanHistoryPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'HotRankingPage',
        path: 'HotRankingPage',
        element: <HotRankingPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'BookSearchPage',
        path: 'BookSearchPage',
        element: <BookSearchPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'BookRatingViewPage',
        path: 'BookRatingViewPage',
        element: <BookRatingViewPage/>,
        category: "LIBRARY-USER"
    },
]
    /*
        {
            label: '',
            path: '/',
            element: </>,
            category: "PLACE"
        },
    */


// {
//     label: 'TEST',
//     path: '/playground1',
//     element: <ComponentPlaygroundPage1/>,
// },
// {
//     label: 'TEST2',
//     path: '/playground2',
//     element: <ComponentPlaygroundPage2/>,
// },


export const GNB_NAV_GROUPS: NavGroup[] = [
    {
        category: "TEST",
        title: "🎯테스트",
    },
    {
        category: "SYSTEM",
        title: "⚙️System",
    },
    {
        category: "LIBRARY-USER",
        title: "👤도서관 이용자",
    },
    {
        category: "PLACE",
        title: "공간예약",
    },
    {
        category: "LIBRARY-ADMIN",
        title: "도서관 관리자",
    },
]
