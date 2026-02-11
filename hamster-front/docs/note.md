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
Zustand (탭 상태 관리 영역에 한정하여 사용)
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
  - TabStore (Zustand)
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
Mock/API 스위치: const IS_MOCK = true; 상수를 사용하여 모킹 데이터와 실제 Axios 호출을 한 줄로 전환 가능하게 설계한다.
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

4. 코드 예시 스니펫 (Reference)
Mock Pattern: if (IS_MOCK) { return MOCK_DATA; } else { return axios.get(...); }
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
│   ├── TempPage.tsx
│   └── usePlayground.ts
└── public
    └── assets

```