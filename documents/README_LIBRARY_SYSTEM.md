# 도서관 관리 시스템 (Library Management System)

React + TypeScript 기반의 종합 도서관 관리 시스템 프론트엔드 애플리케이션입니다.

---

## 🎯 프로젝트 개요

도서관의 도서, 대출, 예약, 평점을 관리하는 웹 기반 관리 시스템입니다.
- **관리자 기능**: 도서 SKU 관리, 대출/예약 내역 조회, 연체 관리, 평점 관리
- **사용자 기능**: 도서 검색, 나의 대출/예약 내역, 평점 등록, 랭킹 조회

---

## ✨ 기능 목록

### 🎯 관리자 (Admin) 페이지

#### 1. 도서 SKU 관리 (`/admin/book-sku`)
- 도서 마스터 데이터 등록, 수정, 삭제
- 검색 및 필터링 (도서명, ISBN, 저자)
- 도서 정보: ISBN, 제목, 저자, 출판사, 출판년도, 청구기호, 분류, 보유 권수 등

#### 2. 대출 기록 조회 (`/admin/loan-history`)
- 검색 조건: 유저명 또는 도서명
- 날짜 범위 검색 (기본 최근 30일, 최대 180일)
- 대출 상태별 조회 (대출중, 반납완료, 연체중)
- 대출 상세 정보 확인

#### 3. 예약 내역 관리 (`/admin/reservations`)
- 검색 필터: 날짜, 사용자 이메일, 도서명, ISBN
- 기본 조회 기간: 지난 7일
- 최대 조회 기간: 180일
- 예약 상태별 조회

#### 4. 연체 관리 (`/admin/overdue`)
- 현재 연체 중인 도서 목록
- 연체자 정보, 연체일수, 연체료 표시
- 도서 정보 (제목, ISBN, 청구기호)

#### 5. 도서 평점 관리 (`/admin/ratings`)
- 등록된 모든 평점 및 리뷰 조회
- ISBN, 도서명 기준 검색
- 평점 통계 확인

---

### 👤 사용자 (User) 페이지

#### 1. 자료 검색 (`/library/search`)
- 검색 유형: 전체, 도서명, 저자
- 도서 상태 표시 (대출가능/대출불가)
- 대출불가 상세 정보 (대출중/정비중)
- 예약 인원 및 반납 예정일 표시
- 대출가능: "상호대차" 버튼
- 대출불가: "도서예약" 버튼

#### 2. 나의 대출 기록 (`/library/my-loans`)
- 기본 조회: 최근 30일
- 조회 가능 기간: 오늘 ~ 최대 180일 전
- 대출 상태별 필터링
- 대출/반납 일자 확인

#### 3. 나의 예약 도서 (`/library/my-reservations`)
- 기본 조회: 최근 30일
- 조회 가능 기간: 오늘 ~ 최대 180일 전
- 예약 상태: 예약대기, 예약대출가능, 예약취소, 대출됨
- 예약 순번 확인
- 대출 가능일 및 만료일 표시

#### 4. 도서 평점 조회 (`/library/ratings`)
- ISBN 기준 도서 평점 조회
- 평균 평점 및 총 평점 수
- 별점 분포도 (5점 ~ 1점)
- 평점 등록 기능
- 나의 평점 수정/삭제

#### 5. 실시간 랭킹 (`/library/realtime-ranking`)
- 기간별 평점 등록 급상승 도서 Top 10
- 기간 선택: 1시간, 10시간, 7일, 30일
- 순위 변동 표시
- 평균 평점 및 평점 수 확인

#### 6. 핫 랭킹 추천 (`/library/hot-ranking`)
- 평점 수와 점수를 결합한 알고리즘 기반 추천
- 맞춤 필터:
  - 성별: 전체, 남, 여, 미상
  - 연령: 영유아부터 60세 이상까지 세분화
  - 지역: 전국 17개 시도
  - 주제: 총류, 철학, 종교, 사회과학, 자연과학, 기술과학, 예술, 언어, 문학, 역사
- 핫 스코어 표시

---

## 🛠 기술 스택

### Core
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구

### Routing & State
- **React Router v7** - 클라이언트 사이드 라우팅
- No state management library (React hooks 사용)

### Styling
- **Tailwind CSS v4** - Utility-first CSS
- **@tailwindcss/postcss** - PostCSS 플러그인
- **class-variance-authority** - 컴포넌트 variant 관리

### UI Components
- **@radix-ui/react-*** - Headless UI 컴포넌트
- **lucide-react** - 아이콘 라이브러리

### HTTP Client
- **Axios** - API 통신
## 📚 개발 가이드

### 코드 규칙

#### 1. TypeScript 사용 원칙
```typescript
// ❌ any 타입 지양
const data: any = fetchData();

// ✅ 명시적 타입 정의
const data: BookSkuMaster = fetchData();
```

#### 2. Derived Union Type 패턴
```typescript
// ❌ Hard-coded 방식
type Status = 'ACTIVE' | 'RETURNED' | 'OVERDUE';
const statuses = ['ACTIVE', 'RETURNED', 'OVERDUE'];

// ✅ Derived 방식 (DRY 원칙)
const STATUSES = ['ACTIVE', 'RETURNED', 'OVERDUE'] as const;
type Status = typeof STATUSES[number];
```

#### 3. Type-Only Imports
```typescript
// ✅ 타입 전용 임포트
import type {BookSkuMaster, PaginatedResponse} from '@/core/types';
import {apiClient} from '@/core/client';
```

#### 4. React Props 타입 정의
```typescript
// 확장이 없을 때: type 사용
type ButtonProps = {
  onClick: () => void;
  label: string;
};

// 확장이 필요할 때: interface 사용
interface ExtendedButtonProps extends ButtonProps {
  variant: 'primary' | 'secondary';
}
```

#### 5. 조건부 함수 호출
```typescript
// ❌ 삼항 연산자 (no-unused-expressions 에러)
const handleClick = () => {
  isValid ? submit() : cancel();
};

// ✅ 명시적 if/else
const handleClick = () => {
  if (isValid) {
    submit();
  } else {
    cancel();
  }
};
```

### 페이지 추가 방법

#### 1. 타입 정의 (필요시 `/src/core/types.ts` 업데이트)

```typescript
export interface NewDomainModel {
  id: number;
  name: string;
  // ... 필드 정의
}
```

#### 2. Mock 데이터 생성 (`/public/mock/새경로`)

```json
{
  "content": [...],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20
}
```

#### 3. Hook 생성 (`/src/pages/[카테고리]/use[도메인].ts`)

```typescript
import {useState, useEffect} from 'react';
import {apiClient} from '@/core/client';
import type {NewDomainModel, PaginatedResponse} from '@/core/types';

export function useNewDomain() {
  const [data, setData] = useState<PaginatedResponse<NewDomainModel>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<PaginatedResponse<NewDomainModel>>('/api/path');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}
```

#### 4. 페이지 컴포넌트 생성 (`/src/pages/[카테고리]/[도메인]Page.tsx`)

```typescript
import {useNewDomain} from './useNewDomain';
import {Card, CardContent} from '@/components/ui/card';

export function NewDomainPage() {
  const {data, loading} = useNewDomain();

  return (
    <div className="space-y-6">
      <h1>페이지 제목</h1>
      {/* UI 구현 */}
    </div>
  );
}
```

#### 5. 네비게이션 등록 (`/src/app/gnb/navigation.config.tsx`)

```typescript
import {NewDomainPage} from '@/pages/category/NewDomainPage';

export const GNB_NAV_ITEMS: NavItem[] = [
  // ... 기존 항목들
  {
    label: '새 메뉴',
    path: '/category/new-domain',
    element: <NewDomainPage />,
    category: "ADMIN" // 또는 "USER"
  },
];
```

---

## 📖 API 문서

전체 API 명세는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 참조

### 주요 엔드포인트

| 기능 | Method | Endpoint | 설명 |
|------|--------|----------|------|
| 도서 SKU 목록 | GET | `/book/sku` | 페이징, 검색 지원 |
| 도서 SKU 등록 | POST | `/book/sku` | 새 도서 등록 |
| 대출 기록 (관리자) | GET | `/loan/admin` | 유저/도서 검색, 날짜 필터 |
| 대출 기록 (유저) | GET | `/loan/my` | 본인 대출 기록만 |
| 예약 내역 (관리자) | GET | `/reservation/admin` | 전체 예약 조회 |
| 예약 내역 (유저) | GET | `/reservation/my` | 본인 예약만 |
| 연체 목록 | GET | `/overdue` | 현재 연체 중인 도서 |
| 평점 등록 | POST | `/rating/register` | ISBN 기준 평점 등록 |
| 평점 통계 | GET | `/rating/view?isbn={isbn}` | 특정 도서 평점 집계 |
| 도서 검색 | GET | `/book/search` | 키워드, 검색 타입 |
| 실시간 랭킹 | GET | `/ranking/realtime?period={period}` | 기간별 Top 10 |
| 핫 랭킹 | GET | `/ranking/hot?gender=...&ageGroup=...` | 필터 기반 추천 |

### Mock/API 전환

`.env` 파일에서 `VITE_API_BASE_URL` 값만 변경:

```bash
# Mock 모드
VITE_API_BASE_URL=/mock

# 실제 백엔드
VITE_API_BASE_URL=http://localhost:8080
```

모든 API 호출이 자동으로 전환됩니다.

---

## 🧪 테스팅

현재 프로젝트는 Mock 데이터로 전체 기능을 테스트할 수 있습니다.

### Mock 데이터 수정 방법

1. `/public/mock/` 하위 JSON 파일 편집
2. 브라우저 새로고침 (즉시 반영)

---

## 🤝 기여 가이드

### Branch 전략
- `main`: 프로덕션 코드
- `develop`: 개발 브랜치
- `feature/기능명`: 기능 개발

### Commit 메시지
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

---

## 📝 라이센스

이 프로젝트는 내부용 도서관 관리 시스템입니다.

---

## 🙋 문의

프로젝트 관련 문의사항은 이슈 트래커를 이용해주세요.

---

## 📅 업데이트 로그

### v1.0.0 (2026-02-12)
- ✅ 관리자 페이지 5종 구현
- ✅ 사용자 페이지 6종 구현
- ✅ Mock 데이터 완전 구현
- ✅ API 문서 작성 완료
- ✅ TypeScript 정석 패턴 적용
