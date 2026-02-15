# 제목 없음

# 📑 Tab-Based Keep-Alive Architecture Guide

## 1. 아키텍처 설계 원칙 (Principles)

- **Encapsulation**: 탭의 상태 관리 로직과 UI 렌더링을 완전히 분리합니다.
- **State Persistence**: `display: none` 방식을 사용하여 DOM을 유지함으로써 폼 입력값 및 스크롤 상태를 보존합니다.
- **URL-Driven**: 모든 탭의 동작은 `react-router-dom`의 URL 변경과 동기화되어야 합니다.
- **Scalability**: 새로운 페이지가 추가되어도 탭 시스템 코드를 수정할 필요가 없도록 `navigation.config`와 연동합니다.

---

## 2. 계층별 책임 범위 (Layer Responsibilities)

| **레이어**             | **담당 파일**          | **핵심 역할**                                             |
|---------------------|--------------------|-------------------------------------------------------|
| **Type Layer**      | `tabs.ts`          | 탭 관련 인터페이스 정의 및 Derived Union Type 선언                 |
| **Logic Layer**     | `TabProvider.tsx`  | 탭 열기/닫기/전환 로직, URL 동기화, `sessionStorage` 연동           |
| **UI Layer (Bar)**  | `TabBar.tsx`       | 탭 목록 렌더링, 활성 탭 스타일링, 닫기 이벤트 전파                        |
| **UI Layer (View)** | `TabContainer.tsx` | 열린 모든 탭의 `element`를 렌더링하되 가시성(`visible/invisible`) 제어 |
| **Layout Layer**    | `AdminLayout.tsx`  | 전체 레이아웃 내에 탭 시스템 배치 및 `Context` 주입                    |

---

## 3. 핵심 데이터 구조 (Data Structure)

TypeScript

`// tabs.ts (Derived Union Type 패턴)
export type TabId = string; // 보통 path를 ID로 사용

export type TabItem = {
id: TabId;
label: string;
path: string;
element: React.ReactNode;
closable?: boolean;
};

export type TabState = {
activeTabId: TabId;
tabs: TabItem[];
};`

---

## 4. 상세 구현 가이드 (Implementation Roadmap)

### Phase 1: 상태 관리 (Logic)

- `useLocation` 훅을 관찰하여 현재 URL이 탭 목록에 없으면 자동으로 `openTab`을 호출합니다.
- `closeTab` 시 현재 활성 탭을 닫는다면, 바로 이전 인덱스의 탭이나 홈으로 포커스를 자동 이동시킵니다.
- `sessionStorage`를 활용하여 새로고침 시에도 열려있던 탭 목록(ID 리스트)을 복구합니다.

### Phase 2: 가시성 제어 (Keep-Alive)

- `TabContainer`는 `tabs` 배열을 `map`으로 순회하며 모든 탭을 렌더링합니다.
- `activeTabId`와 일치하지 않는 탭은 `absolute inset-0 invisible opacity-0 pointer-events-none` 처리를 하여 메모리에만 유지합니다.
- `active` 상태인 탭에만 `z-index`를 높여 화면에 노출합니다.

### Phase 3: 네비게이션 연동

- `GNB` 메뉴 클릭 시 `Maps(path)`를 호출하면, `TabProvider`의 `useEffect`가 이를 감지하여 탭을 생성하거나 활성화합니다.
- 탭 바의 `X` 버튼 클릭 시 `closeTab`을 통해 상태를 제거합니다.

---

## 5. 사후 유지보수 가이드

- **성능 최적화**: 탭이 10개 이상 넘어갈 경우 오래된 탭부터 메모리에서 해제하는 `LRU Cache` 전략 도입을 고려할 수 있습니다.
- **독립성**: 페이지 내부 로직(`usePageHook.ts`)은 자신이 탭으로 열려있는지 알 필요가 없도록 설계되어야 합니다.

---

이 설계안은 계층간 결합도를 낮추어, 나중에 탭 바의 디자인만 바꾸거나 상태 저장소를 변경하더라도 다른 계층에 영향을 주지 않도록 구성되었습니다.



------



잘못된
```
import ReactNode from "react";
```
- 타입 임포트 시에는 명시적으로 type 을 명시해야함

올바른 임포트
```
import type ReactNode from "react";
```
