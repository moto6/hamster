// @/app/gnb/config/navigation.config.tsx

import type {ComponentType, ReactNode} from "react";
import type {Role} from "@/core/auth/role.ts";

import {PlaceDashboardPage} from "@/pages/place/PlaceDashboardPage.tsx";
import {BuildingManagementPage} from "@/pages/place/BuildingManagementPage.tsx";
import {ReservationManagementPage} from "@/pages/place/ReservationManagementPage.tsx";
import {ResourceManagementPage} from "@/pages/place/ResourceManagementPage.tsx";
import {RoomManagementPage} from "@/pages/place/RoomManagementPage.tsx";
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
import {BookSkuManagementPageV2} from "@/pages/library/admin/BookSkuManagementPageV2.tsx";
import {IssuesListPage} from "@/pages/jira/IssuesListPage.tsx";
import {Layers, ListChecks, type LucideProps, MapPin} from "lucide-react";
import {ComponentsPage} from "@/pages/jira/ComponentsPage.tsx";
import {ReleasesPage} from "@/pages/jira/ReleasesPage.tsx";

export type NavCategory = "TEST" | "LIBRARY-USER" | "SYSTEM" | "PLACE" | "LIBRARY-ADMIN" | "JIRA"

interface NavGroup {
    category: NavCategory
    title: string
    hidden?: boolean;
}

export interface NavItem {
    path: string
    label: string
    element: ReactNode
    category: NavCategory
    //
    icon?: ComponentType<LucideProps>
    //icon?: ComponentType<LucideProps | any>
    description?: string
    hidden?: boolean;
    /** 지정 시 이 역할 중 하나라도 가진 사용자에게만 노출/접근 허용(페이지/백엔드에서도 재검증). */
    roles?: Role[];
}

const PROJECT_KEY = 'KAFKA';

export const GNB_NAV_ITEMS: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/admin',
        element: <DashboardPage/>,
        category: "TEST",
        hidden: true,
    },
    {
        label: '도서관 이용 현황',
        path: '/my-admin',
        element: <MyAdminPage/>,
        category: "TEST"
    },
    {
        label: 'Users',
        path: '/users',
        element: <UserPage/>,
        category: "TEST",
        hidden: true,
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
        label: '장서/SKU 관리_DEPRECATED',
        path: '/admin/book/sku-depre',
        element: <BookSkuManagementPage/>,
        category: "LIBRARY-ADMIN",
        hidden: true,
    },
    {
        label: '장서/SKU 관리',
        path: '/admin/book/sku',
        element: <BookSkuManagementPageV2/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '대출 기록 조회',
        path: '/admin/loans',
        element: <AdminLoanHistoryPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '예약 관리',
        path: '/admin/reservation',
        element: <AdminReservationPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '연체 관리',
        path: '/library-admin/overdue',
        element: <OverdueManagementPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: '도서 평점 관리',
        path: '/admin/rating',
        element: <BookRatingManagementPage/>,
        category: "LIBRARY-ADMIN"
    },
    {
        label: 'RealtimeRankingPage',
        path: '/RealtimeRankingPage',
        element: <RealtimeRankingPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: '나의 예약 도서',
        path: '/library/reservations',
        element: <MyReservationPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: '나의 대출 기록',
        path: '/library/loans',
        element: <MyLoanHistoryPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: '핫 랭킹 추천',
        path: '/library/hot-ranking',
        element: <HotRankingPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: '자료 검색',
        path: '/library/search',
        element: <BookSearchPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: '실시간 랭킹',
        path: '/library/realtime-ranking',
        element: <BookRatingViewPage/>,
        category: "LIBRARY-USER"
    },
    {
        label: 'IssuesListPage',
        path: `/jira/projects/${PROJECT_KEY}/issues`,
        element: <IssuesListPage/>,
        icon: ListChecks,
        category: "JIRA",
    },
    //
    {
        label: 'Components',
        path: `/jira/projects/${PROJECT_KEY}/components`,
        element: <ComponentsPage/>,
        icon: Layers,
        category: "JIRA",
    },
    {
        label: 'Roadmap',
        path: `/jira/projects/${PROJECT_KEY}/releases`,
        element: <ReleasesPage/>,
        icon: MapPin,
        category: "JIRA",
    },
]
    /*


    {
{
label: 'Components',
icon: Layers,
to: `/jira/projects/${PROJECT_KEY}/components`,
},
{
label: 'Roadmap',
icon: MapPin,
to: `/jira/projects/${PROJECT_KEY}/releases`,
},


        {
            label: '',
            path: '/',
            element: </>,
            category: "JIRA"
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
        category: "JIRA",
        title: "지라",
        hidden: false,
    },
    {
        category: "TEST",
        title: "🎯개발테스트",
        hidden: false,
    },
    {
        category: "SYSTEM",
        title: "⚙️System",
        hidden: true,
    },
    {
        category: "LIBRARY-ADMIN",
        title: "도서관 관리자",
        hidden: true,
    },
    {
        category: "LIBRARY-USER",
        title: "👤도서관 이용자",
        hidden: true,
    },
    {
        category: "PLACE",
        title: "공간예약",
        hidden: true,
    },
]

/**
 * 메뉴/라우트 접근 가능 여부. roles 가 없으면 누구나, 있으면 그중 하나라도 보유해야 한다.
 * (SUPER_ADMIN 은 모든 관리자 메뉴의 roles 에 포함시켜 두면 전 메뉴 접근이 된다)
 */
export function canAccessNav(item: NavItem, roles: string[]): boolean {
    if (!item.roles || item.roles.length === 0) return true
    return item.roles.some(r => roles.includes(r))
}
