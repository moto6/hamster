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
Hook 중심 설계: use[Domain]Dashboard.ts 파일 하나에 Interface, Mock Data, Fetch 로직을 모두 포함한다. (Service 클래스 분리 지양)
Mock/API 스위치: export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true'; 상수를 사용하여 모킹 데이터와 실제 Axios 호출을 한 줄로 전환 가능하게 설계한다.
상태 관리: data, isLoading, error, refetch 4종 세트를 기본 반환한다.

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

4. 개발 및 코드 추가시 주의사항
- 정석적인 방법으로 개발하며, Best Practice 방법으로 널리 인정받는 방향으로 개발되어야만 합니다

5. 코드 예시 스니펫 (Reference)
Mock Pattern: if (IS_MOCK) { return MOCK_DATA; } else { return axios.get(...); }
```
```text
이거는 이미 구현된 코드들이야 필요한 경우에만 가져다가 써
├── components
│   └── place
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Label.tsx
│       ├── Popover.tsx
│       ├── RadioGroup.tsx
│       └── Select.tsx

아래 컴포넌트들은 베이스코드를 넣어줄수 있으니까 알아서 만들지말고 따로 넣어달라고 해
 ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.ts
│       └── utils.ts


```
```
src
├── app
│   ├── AdminLayout.tsx
│   ├── Footer.tsx
│   ├── gnb
│   │   ├── Gnb.tsx
│   │   └── navigation.config.tsx
│   ├── Header.tsx
│   ├── router.tsx
│   └── tab
│       ├── TabBar.tsx
│       ├── TabContainer.tsx
│       └── tabs.ts
├── components
│   └── place
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Label.tsx
├── core
│   ├── accountInfo.ts
│   ├── client.ts
│   ├── types
│   │   ├── scheduleRepeatPeriod.ts
│   │   └── scheduleStatus.ts
│   ├── types.ts
│   └── utils.ts
├── index.css
├── main.tsx
├── pages
│   ├── admin
│   │   ├── DashboardPage.tsx
│   │   ├── DemoPage.tsx
│   │   └── MyAdminPage.tsx
│   ├── ComponentPlaygroundPage1.tsx
│   ├── place
│   │   ├── BuildingManagementPage.tsx
│   │   ├── PlaceDashboardPage.tsx
│   │   ├── useBuildingList.ts
│   │   └── usePlaceDashboard.ts
│   ├── SchedulePage.tsx
│   └── usePlayground1.ts
└── public
    └── assets

```