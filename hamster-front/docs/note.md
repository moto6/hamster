# Admin Frontend Architecture Summary

## 프로젝트 개요
- 본 프로젝트는 어드민 스타일 SPA 프론트엔드 셸을 기반으로 한 탭 기반 UI 구조입니다.
- 좌측 GNB + 상단 Header + 탭 네비게이션 + 컨텐츠 영역 + Footer 구조로 설계되었습니다
- 여러 페이지를 크롬 브라우저 스타일의 탭으로 열고 상태를 유지하는 것을 목표로 합니다.

## 기술 스택
### Core
```
React 19
TypeScript
Vite
React Router v7
```
### Styling
```
Tailwind CSS v4
PostCSS + @tailwindcss/postcss
Utility-first 스타일링 방식
```
## 프론트엔드 구조
## 라우팅 & 네비게이션 설계

### 메뉴 정의 방식
- 메뉴는 config 기반으로 선언
    - path
    - label
    - element (ReactNode)
- navigation.config.tsx 에서 관리
- GNB는 이 설정을 기반으로 자동 렌더링된다.
    - JSX/TSX 기반 element 등록

### 페이지 추가 개발시

- 아래 형태로 등록하여 탭 캐시 및 상태 유지 가능하게 설계됨.
```
element: <SomePage />
```
### 전체 화면 레이아웃 구성
```
┌──────────────┬─────────────────────────────────────────────────┐
│   GNB        │ Header                                          │
│              ├─────────────────────────────────────────────────┤
│              │ TabBar                                          │
│              │ Content - ##                                    │
│              ├─────────────────────────────────────────────────┤
│              │ Footer                                          │
└──────────────┴─────────────────────────────────────────────────┘
```

## Kick 포인트
### 탭 기반 UI 아키텍처
- 목적
  - 크롬 브라우저 스타일 멀티 탭
  - 탭 전환 시 상태 유지
  - 폼 입력 값 유지
  - 재렌더링 최소화

- 구성
  - TabStore
  - 열린 탭 목록
  - activeTab 관리
  - openTab / closeTab

- 핵심컴포넌트 설명
  - TabBar
    - 탭 UI 렌더링
    - 활성 탭 전환
    - 탭 닫기
  - TabContainer
    - 열린 탭 element 렌더링
    - ReactNode 기반 keep-alive


## 개발 가이드
```text
[hamster-front] Admin 개발 가이드라인

1. 기술 스택 및 환경
Framework: React 19 (Vite)
Styling: Tailwind CSS v4.0 (CSS variables 기반 @theme 확장)
Icons: Lucide-react
Typography: Noto Sans KR (자간 -0.02em, 숫자 Tabular Figures 적용)
Data Fetching: Axios 기반 (Custom Hook에서 직접 처리)

2. 아키텍처 규칙: "All-in-One Hook"
Hook 중심 설계: use[Domain]Dashboard.ts 파일 하나에 Interface, Fetch 로직을 모두 포함한다. (Service 클래스 분리 지양)
Mock Data 는 public/mock/~ 경로에 json 형식으로 데이터를 생성한다
Mock/API 스위치:  Mock 데이터는 .json 파일로 만들어두고,  경로는 {프로젝트}/public/mock 밑에 apiPath 붙여서
 ㄴ 예시 : {VITE_API_BASE_URL}/book/sku
   (백엔드 존재시) VITE_API_BASE_URL=http://localhost:8080
   (MOCK 모드일때) VITE_API_BASE_URL={프론트엔드SELF}/public/mock
  - 모킹 데이터와 실제 Axios 호출을 한 줄로 전환 가능하게 설계한다.

3. 코드 및 스타일 가이드
- 기존 데이터 변경 최소화
- 코드 및 파일 스타일은 ~Page(리액트 페이지), use~(훅)
- 서브컴포넌트는 임의로 만들지 말것
- any타입 최대한 지향하고 TypeScript 정석적인 방법으로 개발할것
- 정석적인 방법으로 개발하고 Work-around(야매) 방법으로 진행하지 말것
- TypeScript의 타입 전용 임포트(Type-Only Imports)/ 인라인 타입 전용 임포트(Inline Type-Only Imports) 문법 사용할것
- cn 은 여기에 있음 : import {cn} from "@/core/utils.ts";
- React Props 정의 시 추가 속성이 없다면 interface 대신 type 별칭(Alias)을 사용하고, 속성 확장이 있을 때만 interface를 사용하는 TypeScript 정석 패턴을 적용할것
- React.FormEvent<>는 사용하지 않는다 
- 함수 호출 시에는 삼항 연산자 대신 명시적인 if/else 문을 사용하여 no-unused-expressions 에러가 없는 정석적인 코드를 작성해야 한다
- 유니온 타입을 정의할 때 리터럴을 직접 나열하지 마세요. 대신 런타임에 사용할 as const 배열을 먼저 선언하고, (typeof ARRAY)[number] 문법을 통해 타입을 추출하는 'Derived Union Type' 패턴을 적용하여 타입과 데이터의 동기화를 보장해줘.
  - DRY (Don't Repeat Yourself) 원칙 준수 
  - Hard-coded 방식: 카테고리가 추가되면 type 정의도 고치고, Select 박스용 array도 고쳐야 합니다. (두 번 일하기)
  - Derived 방식: RESOURCE_CATEGORIES 배열에 항목만 추가하면 타입은 알아서 따라옵니다. (한 번만 일하기)
  - 런타임과 컴파일 타임의 완벽한 동기화 : 리액트에서는 UI 렌더링을 위해 실제 **배열(값)**이 필요합니다. 타입을 배열에서 추출하면, UI에 뿌려지는 값과 타입스크립트가 검사하는 값이 절대로 틀어질 일이 없습니다.
  - 타입 추론의 우수성 : Object.keys()나 Object.values()를 쓸 때 발생하는 번거로운 타입 캐스팅(as ResourceCategory[])이 필요 없습니다. 배열 자체가 이미 가장 좁은(narrow) 타입인 리터럴들의 모음이기 때문입니다.
- 상태관리 라이브러리(zustand 등..) 은 사용하지 않아야 한다

4. 개발 및 코드 추가시 주의사항
- 정석적인 방법으로 개발하며, Best Practice 방법으로 널리 인정받는 방향으로 개발되어야만 합니다

5. package.json 내용 
- radix-ui/* , lucide-react, 범위 내에서 처리하고 추가적인 라이브러리가 필요한 경우에만 제한적으로 추가해
 "dependencies": {
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "axios": "^1.13.5",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0",
```
```text
이거는 이미 구현된 코드 베이스야 코드베이스 존중해서 기능만 추가할 수 있도록 만들어

hamster-front | main >5 !2 ?2
> ls
components.json		package-lock.json	tailwind.config.js
Dockerfile		package.json		tsconfig.app.json
docs			postcss.config.js	tsconfig.json
eslint.config.js	public			tsconfig.node.json
index.html		README.md		vite.config.ts
node_modules		src

---

hamster-front | main >5 !2 ?2
> tree src
src
├── app
│   ├── AdminLayout.tsx
│   ├── AppRoutes.tsx
│   ├── Footer.tsx
│   ├── gnb
│   │   ├── Gnb.tsx
│   │   └── navigation.config.tsx
│   ├── Header.tsx
│   ├── router.tsx
├── components
│   └── place
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── Popover.tsx
│       ├── RadioGroup.tsx
│       └── Select.tsx
├── core
│   ├── accountInfo.ts
│   ├── client.ts
│   ├── mock
│   │   └── mockData.ts
│   ├── types
│   │   ├── scheduleRepeatPeriod.ts
│   │   └── scheduleStatus.ts
│   ├── types.ts
│   └── utils.ts
├── index.css
├── main.tsx
├── pages
│   ├── admin
│   │   ├── DashboardPage.tsx
│   │   ├── DemoPage.tsx
│   │   └── MyAdminPage.tsx
│   ├── ComponentPlaygroundPage1.tsx
│   ├── ComponentPlaygroundPage2.tsx
│   ├── place
│   │   ├── BuildingManagementPage.tsx
│   │   ├── PlaceDashboardPage.tsx
│   │   ├── ReservationManagementPage.tsx
│   │   ├── ResourceManagementPage.tsx
│   │   ├── RoomManagementPage.tsx
│   │   ├── SchedulePage.tsx
│   │   ├── uesResourceManagement.ts
│   │   ├── useBuildingList.ts
│   │   ├── usePlaceDashboard.ts
│   │   ├── useReservationManagement.ts
│   │   ├── useRoomManagement.ts
│   │   └── useSchedule.ts
│   ├── TempPage.tsx
│   ├── usePlayground1.ts
│   └── usePlayground2.ts
└── public
    └── assets

14 directories, 45 files

```

## 기존 메인코드
```
// @/main.tsx
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './index.css'
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<AdminLayout/>}>
                    <Route path="/" element={<Navigate to="/admin" replace/>}/>
                    {GNB_NAV_ITEMS.map((item) => (
                        <Route
                            key={item.path}
                            path={item.path}
                            element={item.element}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)


// @/app/AdminLayout.tsx

import {Gnb} from "@/app/gnb/Gnb.tsx";
import {Link, Outlet} from "react-router-dom";
import Header from "@/app/Header.tsx";
import Footer from "@/app/Footer.tsx";

export function AdminLayout() {
    return (
        <div className="flex h-screen dark:bg-slate-950">

            {/* 좌측 GNB */}
            <aside className="
        w-[200px]
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        flex flex-col
        shrink-0
      ">
                {/* 로고 영역 */}
                <div className="
          h-16
          flex items-center
          px-6
          border-b border-slate-200 dark:border-slate-800
        ">
                    <Link to="/" className="no-underline">
                        <h2 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                            Library <span className="font-bold">Admin</span>
                        </h2>
                    </Link>
                </div>

                {/* 네비 영역 */}
                <div className="flex-1 overflow-y-auto bg-slate-100">
                    <Gnb/>
                </div>
            </aside>

            {/* 우측 메인 영역 */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header/>
                <main className=" flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <Outlet/>
                    </div>
                </main>
                <Footer/>
            </div>
        </div>
    )
}



// @/app/gnb/Gnb.tsx
import {useNavigate} from 'react-router-dom'
import {GNB_NAV_GROUPS, GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";


export function Gnb() {
    const navigate = useNavigate()


    return (
        <div className="flex flex-col">

            {/* 상단 타이틀 */}
            <div className="px-4 py-4 text-lg font-bold border-b border-slate-700">
                {/*Navigation*/}
            </div>

            <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">

                {GNB_NAV_GROUPS.map(group => {
                    const items = GNB_NAV_ITEMS.filter(
                        i => i.category === group.category && !i.hidden
                    )

                    if (items.length === 0) return null

                    return (
                        <div key={group.category}>
                            {/* 그룹 타이틀 */}
                            <div className="
                px-3 mb-1
                text-xs uppercase
                tracking-wider
                text-slate-400
              ">
                                {group.title}
                            </div>

                            {/* 그룹 메뉴 */}
                            <div className="space-y-1">
                                {items.map(item => (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className="w-full text-left px-3 py-2 rounded transition text-sm
                                                text-slate-600 dark:text-slate-300
                                                hover:bg-slate-200 dark:hover:bg-slate-800
                                                hover:text-slate-900 dark:hover:text-slate-100">
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}

            </nav>
        </div>
    )
}



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


```