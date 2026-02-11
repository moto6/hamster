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
