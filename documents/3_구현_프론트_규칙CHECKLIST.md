# 구현규칙 Checklist
---

- 너가 구글러라고 생각하고 글로벌 빅테크 표준으로 쓰일법한
- 꼼수나, 보안위험사항이 생길만한 Work-around 는 하지 않아. 
- 작업이 불가능하거나 불합리한경우 시킨대로 하지말고 작업대신 어떤부분이 불합리한지 응답해줘
---


## 페이지 디자인 가이드
```tsx
<h1 className="text-2xl font-semibold text-slate-700">각 페이지의 최상단 제목 샘플</h1>
<p className="text-sm text-slate-500 mt-1">페이지 설명을 넣는 공간입니다</p>
```


## 🧩 TypeScript 패턴 적용

### Derived Union Type
- [x] `SEARCH_TYPES` 배열 → `SearchType` 타입 추출
- [x] `RESERVATION_STATUSES` → `ReservationStatus`
- [x] `RANKING_PERIODS` → `RankingPeriod`
- [x] `GENDERS` → `Gender`
- [x] `AGE_GROUPS` → `AgeGroup`
- [x] `REGIONS` → `Region`
- [x] `SUBJECTS` → `Subject`

### Type-Only Imports
- [x] 모든 파일에서 `import type` 사용

### Props 타입 정의
- [x] 확장 없음 → `type` 사용
- [x] 확장 필요 → `interface` 사용

### No Any Type
- [x] 모든 변수/함수에 명시적 타입

### 명시적 조건문
- [x] 삼항 연산자 대신 if/else 사용


## ✅ 최종 확인

### 코드 품질
- [x] TypeScript strict 모드 준수
- [x] ESLint 규칙 준수
- [x] 일관된 코딩 스타일
- [x] 주석 필요 부분 작성 & 불필요한 주석 제거
- [x] Console.log 제거 (에러만 console.error)

### 성능
- [x] 불필요한 re-render 방지
- [x] useEffect dependency 최적화
- [x] 페이징 구현
- [x] 로딩 상태 표시
