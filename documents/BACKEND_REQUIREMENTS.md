# Backend API Requirements

프론트엔드가 완성되었으므로, 백엔드 개발자가 구현해야 할 API 목록입니다.

## 🎯 개요

- **API 총 개수**: 19개
- **Base URL**: `http://localhost:8080` (예시)
- **인증 방식**: JWT Bearer Token (헤더: `Authorization: Bearer {token}`)
- **응답 형식**: JSON
- **날짜 형식**: ISO 8601 (예: `2026-02-12T10:30:00Z`)

---

## 📊 우선순위별 API 구현 순서

### 🚀 Phase 1 - 핵심 기능 (관리자)

#### 1. 도서 SKU 관리 (4개 API)
- `GET /book/sku` - 도서 목록 조회
- `POST /book/sku` - 도서 등록
- `PUT /book/sku/{id}` - 도서 수정
- `DELETE /book/sku/{id}` - 도서 삭제

#### 2. 대출 관리 (2개 API)
- `GET /loan/admin` - 관리자 대출 기록 조회
- `GET /loan/my` - 사용자 대출 기록 조회

#### 3. 예약 관리 (4개 API)
- `GET /reservation/admin` - 관리자 예약 내역 조회
- `GET /reservation/my` - 사용자 예약 내역 조회
- `POST /reservation` - 예약 등록
- `DELETE /reservation/{id}` - 예약 취소

---

### ⚡ Phase 2 - 추가 관리 기능

#### 4. 연체 관리 (1개 API)
- `GET /overdue` - 연체 목록 조회

#### 5. 평점 관리 (5개 API)
- `GET /rating` - 전체 평점 조회 (관리자)
- `GET /rating/view` - 특정 도서 평점 통계 조회
- `POST /rating/register` - 평점 등록
- `PUT /rating/{id}` - 평점 수정
- `DELETE /rating/{id}` - 평점 삭제

---

### 🔥 Phase 3 - 랭킹 시스템

#### 6. 랭킹 (2개 API)
- `GET /ranking/realtime` - 실시간 랭킹
- `GET /ranking/hot` - 핫 랭킹 추천

#### 7. 도서 검색 (1개 API)
- `GET /book/search` - 도서 검색

---

## 📝 상세 API 명세

### 1️⃣ 도서 SKU 관리

#### GET /book/sku
도서 SKU 목록 조회 (페이징, 검색 지원)

**Query Parameters:**
```
keyword?: string      // 검색 키워드 (도서명, ISBN, 저자)
category?: string     // 도서 분류 필터
page: number         // 페이지 번호 (0-based)
pageSize: number     // 페이지 크기 (기본 20)
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "isbn": "9788936433598",
      "title": "채식주의자",
      "author": "한강",
      "publisher": "창비",
      "publishYear": 2007,
      "callNumber": "813.7-한12ㅊ",
      "category": "문학",
      "description": "한국 현대문학의 걸작",
      "coverImageUrl": "https://...",
      "totalCopies": 5,
      "availableCopies": 3,
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-02-10T14:30:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 20
}
```

---

#### POST /book/sku
도서 SKU 등록

**Request Body:**
```json
{
  "isbn": "9788936433598",
  "title": "채식주의자",
  "author": "한강",
  "publisher": "창비",
  "publishYear": 2007,
  "callNumber": "813.7-한12ㅊ",
  "category": "문학",
  "description": "한국 현대문학의 걸작",
  "coverImageUrl": "https://...",
  "totalCopies": 5
}
```

**Response 201:**
```json
{
  "id": 1,
  "isbn": "9788936433598",
  // ... 전체 도서 정보
  "availableCopies": 5,
  "createdAt": "2024-02-12T10:00:00Z",
  "updatedAt": "2024-02-12T10:00:00Z"
}
```

**Validation:**
- ISBN: 필수, 중복 불가
- title, author, publisher: 필수
- publishYear: 필수, 1900 ~ 현재년도
- totalCopies: 필수, 1 이상

---

#### PUT /book/sku/{id}
도서 SKU 수정

**Path Parameters:**
- `id`: 도서 ID

**Request Body:** (수정할 필드만 전송)
```json
{
  "totalCopies": 10,
  "description": "수정된 설명"
}
```

**Response 200:** 수정된 전체 도서 정보

---

#### DELETE /book/sku/{id}
도서 SKU 삭제

**Path Parameters:**
- `id`: 도서 ID

**Response 204:** No Content

**Business Logic:**
- 대출 중이거나 예약이 있는 도서는 삭제 불가 → 400 에러

---

### 2️⃣ 대출 관리

#### GET /loan/admin
관리자 대출 기록 조회

**Query Parameters:**
```
searchType: '유저명' | '도서명'
keyword?: string
startDate: string    // ISO format, 필수
endDate: string      // ISO format, 필수
page: number
pageSize: number
```

**Validation:**
- 날짜 범위: 최대 180일
- 기본 조회 기간: 최근 30일

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 101,
      "userName": "김철수",
      "userEmail": "chulsoo@example.com",
      "loanDate": "2024-02-01T10:00:00Z",
      "dueDate": "2024-02-15T23:59:59Z",
      "returnDate": "2024-02-14T15:30:00Z",
      "status": "RETURNED",  // ACTIVE | RETURNED | OVERDUE
      "totalItems": 2,
      "createdAt": "2024-02-01T10:00:00Z",
      "updatedAt": "2024-02-14T15:30:00Z",
      "details": [
        {
          "id": 1,
          "loanMasterId": 1,
          "bookSkuId": 1,
          "inventoryId": 101,
          "bookTitle": "채식주의자",
          "bookIsbn": "9788936433598",
          "callNumber": "813.7-한12ㅊ",
          "loanDate": "2024-02-01T10:00:00Z",
          "dueDate": "2024-02-15T23:59:59Z",
          "returnDate": "2024-02-14T15:30:00Z",
          "status": "RETURNED",
          "createdAt": "2024-02-01T10:00:00Z",
          "updatedAt": "2024-02-14T15:30:00Z"
        }
      ]
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

**Business Logic:**
- `searchType`이 "유저명"이면 `userName`에서 검색
- `searchType`이 "도서명"이면 `details.bookTitle`에서 검색
- `status`는 자동 계산:
  - 반납 안 함 + 반납기한 지남 → `OVERDUE`
  - 반납 안 함 + 반납기한 안 지남 → `ACTIVE`
  - 반납 완료 → `RETURNED`

---

#### GET /loan/my
사용자 대출 기록 조회 (본인만)

**Query Parameters:**
```
startDate: string    // ISO format
endDate: string      // ISO format
page: number
pageSize: number
```

**Validation:**
- 기본: 최근 30일
- 최대: 180일

**Response:** `/loan/admin`와 동일하지만 현재 로그인 유저의 데이터만

**Authentication:**
- JWT 토큰에서 userId 추출
- 해당 userId의 대출 기록만 반환

---

### 3️⃣ 예약 관리

#### GET /reservation/admin
관리자 예약 내역 조회

**Query Parameters:**
```
startDate: string      // 기본: 지난 7일
endDate: string        // 기본: 오늘
userEmail?: string
bookTitle?: string
isbn?: string
page: number
pageSize: number
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 104,
      "userName": "정지훈",
      "userEmail": "jihoon@example.com",
      "bookSkuId": 2,
      "bookTitle": "82년생 김지영",
      "bookIsbn": "9788934942467",
      "reservationDate": "2024-02-10T09:00:00Z",
      "availableDate": "2024-02-19T10:00:00Z",
      "expiryDate": "2024-02-22T23:59:59Z",
      "status": "예약대출가능",  // 예약대기 | 예약대출가능 | 예약취소 | 대출됨
      "queuePosition": 1,
      "createdAt": "2024-02-10T09:00:00Z",
      "updatedAt": "2024-02-19T10:00:00Z"
    }
  ],
  "totalElements": 20,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20
}
```

**Business Logic:**
- `status` 자동 계산:
  - 도서 반납됨 + 예약 순번 1위 → `예약대출가능`
  - 도서 아직 안 반납됨 → `예약대기`
  - 사용자가 취소 → `예약취소`
  - 대출로 전환됨 → `대출됨`
- `queuePosition`: 같은 도서의 예약 순번
- `availableDate`: 대출 가능 일시 (예약대출가능 상태일 때만)
- `expiryDate`: 대출 가능 기한 (3일 후 자동 취소)

---

#### GET /reservation/my
사용자 예약 내역 조회 (본인만)

**Query Parameters:**
```
startDate: string
endDate: string
page: number
pageSize: number
```

**Response:** `/reservation/admin`과 동일, 현재 유저만

---

#### POST /reservation
예약 등록

**Request Body:**
```json
{
  "bookSkuId": 2
}
```

**Response 201:**
```json
{
  "id": 10,
  "userId": 101,
  "userName": "김철수",
  "userEmail": "chulsoo@example.com",
  "bookSkuId": 2,
  "bookTitle": "82년생 김지영",
  "bookIsbn": "9788934942467",
  "reservationDate": "2024-02-12T14:00:00Z",
  "status": "예약대기",
  "queuePosition": 3,
  "createdAt": "2024-02-12T14:00:00Z",
  "updatedAt": "2024-02-12T14:00:00Z"
}
```

**Validation:**
- 같은 도서에 대해 중복 예약 불가
- 이미 대출 중인 도서는 예약 불가

---

#### DELETE /reservation/{id}
예약 취소

**Path Parameters:**
- `id`: 예약 ID

**Response 204:** No Content

**Business Logic:**
- 본인의 예약만 취소 가능
- 이미 `대출됨` 상태는 취소 불가 → 400 에러

---

### 4️⃣ 연체 관리

#### GET /overdue
연체 목록 조회

**Query Parameters:**
```
page: number
pageSize: number
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "loanDetailId": 4,
      "userId": 103,
      "userName": "박민수",
      "userEmail": "minsoo@example.com",
      "bookSkuId": 4,
      "bookTitle": "사피엔스",
      "bookIsbn": "9788932473901",
      "callNumber": "909-하231ㅅ",
      "dueDate": "2024-02-03T23:59:59Z",
      "overdueDays": 9,
      "fineAmount": 900,
      "createdAt": "2024-02-04T00:00:00Z",
      "updatedAt": "2024-02-12T00:00:00Z"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20
}
```

**Business Logic:**
- `overdueDays`: 오늘 날짜 - 반납 예정일
- `fineAmount`: `overdueDays × 100` (일당 100원)
- 반납되지 않은 대출 중 `dueDate`가 지난 것만 포함

---

### 5️⃣ 평점 관리

#### GET /rating
전체 평점 조회 (관리자)

**Query Parameters:**
```
isbn?: string
bookTitle?: string
page: number
pageSize: number
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "bookSkuId": 1,
      "bookIsbn": "9788936433598",
      "bookTitle": "채식주의자",
      "userId": 101,
      "userName": "김철수",
      "rating": 5,
      "review": "정말 인상 깊은 작품입니다.",
      "createdAt": "2024-02-01T16:00:00Z",
      "updatedAt": "2024-02-01T16:00:00Z"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

---

#### GET /rating/view
특정 도서 평점 통계 조회

**Query Parameters:**
```
isbn: string  // 필수
```

**Response 200:**
```json
{
  "bookSkuId": 1,
  "bookIsbn": "9788936433598",
  "bookTitle": "채식주의자",
  "averageRating": 4.5,
  "totalRatings": 100,
  "ratingDistribution": {
    "star5": 60,
    "star4": 30,
    "star3": 8,
    "star2": 1,
    "star1": 1
  }
}
```

**Business Logic:**
- `averageRating`: 평균 평점 (소수점 1자리)
- `totalRatings`: 총 평점 개수
- `ratingDistribution`: 별점별 개수

---

#### POST /rating/register
평점 등록

**Request Body:**
```json
{
  "isbn": "9788936433598",
  "rating": 5,
  "review": "정말 인상 깊은 작품입니다."
}
```

**Validation:**
- `rating`: 1~5 정수
- `review`: 선택사항, 최대 500자

**Response 201:**
```json
{
  "id": 101,
  "bookSkuId": 1,
  "bookIsbn": "9788936433598",
  "bookTitle": "채식주의자",
  "userId": 101,
  "userName": "김철수",
  "rating": 5,
  "review": "정말 인상 깊은 작품입니다.",
  "createdAt": "2024-02-12T15:00:00Z",
  "updatedAt": "2024-02-12T15:00:00Z"
}
```

**Business Logic:**
- ISBN으로 BookSkuMaster 조회 → bookSkuId 매핑
- 같은 유저가 같은 도서에 중복 평점 불가 → 400 에러

---

#### PUT /rating/{id}
평점 수정

**Path Parameters:**
- `id`: 평점 ID

**Request Body:**
```json
{
  "rating": 4,
  "review": "수정된 리뷰입니다."
}
```

**Response 200:** 수정된 평점 정보

**Validation:**
- 본인의 평점만 수정 가능

---

#### DELETE /rating/{id}
평점 삭제

**Path Parameters:**
- `id`: 평점 ID

**Response 204:** No Content

**Validation:**
- 본인의 평점만 삭제 가능

---

### 6️⃣ 랭킹 시스템

#### GET /ranking/realtime
실시간 랭킹 조회

**Query Parameters:**
```
period: '1시간' | '10시간' | '7일' | '30일'
```

**Response 200:**
```json
{
  "period": "1시간",
  "updatedAt": "2024-02-12T14:00:00Z",
  "rankings": [
    {
      "rank": 1,
      "bookSkuId": 2,
      "isbn": "9788934942467",
      "title": "82년생 김지영",
      "author": "조남주",
      "publisher": "민음사",
      "coverImageUrl": "https://...",
      "ratingCount": 45,
      "ratingCountChange": 12,
      "averageRating": 4.8
    }
  ]
}
```

**Business Logic:**
- `ratingCount`: 해당 기간 동안 등록된 평점 수
- `ratingCountChange`: 이전 기간 대비 증가량
- Top 10만 반환
- 내림차순 정렬

---

#### GET /ranking/hot
핫 랭킹 추천

**Query Parameters:**
```
gender: '전체' | '남' | '여' | '미상'
ageGroup: '전체' | '영유아(0~5세)' | ... (14개 옵션)
region: '전체' | '서울' | '부산' | ... (18개 옵션)
subject: '전체' | '총류' | '철학' | ... (11개 옵션)
```

**Response 200:**
```json
{
  "rankings": [
    {
      "rank": 1,
      "bookSkuId": 4,
      "isbn": "9788932473901",
      "title": "사피엔스",
      "author": "유발 하라리",
      "publisher": "김영사",
      "coverImageUrl": "https://...",
      "hotScore": 95.8,
      "averageRating": 4.7,
      "totalRatings": 1247
    }
  ]
}
```

**Business Logic:**
- `hotScore` 알고리즘:
  ```
  hotScore = (averageRating × 10) + log10(totalRatings) × 20
  ```
- 필터링:
  - 성별, 연령, 지역은 User 정보 기반
  - 주제는 BookSkuMaster.category 기반
  - "전체"는 필터 적용 안 함
- Top 10만 반환

---

### 7️⃣ 도서 검색

#### GET /book/search
도서 검색

**Query Parameters:**
```
keyword: string
searchType: '전체' | '도서명' | '저자'
page: number
pageSize: number
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "isbn": "9788936433598",
      "title": "채식주의자",
      "author": "한강",
      "publisher": "창비",
      "publishYear": 2007,
      "callNumber": "813.7-한12ㅊ",
      "category": "문학",
      "description": "...",
      "coverImageUrl": "https://...",
      "totalCopies": 5,
      "availableCopies": 3,
      "createdAt": "...",
      "updatedAt": "...",
      "status": "대출가능",  // 대출가능 | 대출불가
      "statusDetail": null,  // 대출중 | 정비중 (대출불가일 때만)
      "reservationCount": 1,
      "expectedReturnDate": "2024-02-20T23:59:59Z"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

**Business Logic:**
- `searchType` 처리:
  - "전체": `title` OR `author`에서 검색
  - "도서명": `title`만 검색
  - "저자": `author`만 검색
- `status`:
  - `availableCopies > 0` → `대출가능`
  - `availableCopies = 0` → `대출불가`
- `statusDetail`:
  - 모든 재고가 `LOANED` → `대출중`
  - 일부 재고가 `MAINTENANCE` → `정비중`
- `reservationCount`: 해당 도서의 활성 예약 수
- `expectedReturnDate`: 가장 빠른 반납 예정일

---

## 🔐 인증 & 권한

### JWT 토큰 구조
```json
{
  "userId": 101,
  "email": "user@example.com",
  "role": "USER",  // ADMIN | USER
  "exp": 1707840000
}
```

### API별 권한

| API | ADMIN | USER |
|-----|-------|------|
| `/book/sku/*` | ✅ | ❌ |
| `/loan/admin` | ✅ | ❌ |
| `/loan/my` | ✅ | ✅ |
| `/reservation/admin` | ✅ | ❌ |
| `/reservation/my` | ✅ | ✅ |
| `/reservation` (POST) | ✅ | ✅ |
| `/overdue` | ✅ | ❌ |
| `/rating` (GET) | ✅ | ❌ |
| `/rating/view` | ✅ | ✅ |
| `/rating/register` | ✅ | ✅ |
| `/rating/{id}` (PUT/DELETE) | ✅ | ✅ (본인만) |
| `/ranking/*` | ✅ | ✅ |
| `/book/search` | ✅ | ✅ |

---

## 📊 데이터베이스 스키마 (참고)

### 테이블 관계
```
BookSkuMaster (1) ─── (N) BookInventoryDetail
                 │
                 └─── (N) LoanDetail
                 │         │
                 │         └─── (1) LoanMaster
                 │
                 └─── (N) Reservation
                 │
                 └─── (N) BookRating

LoanDetail (1) ─── (0..1) LoanOverdue

User (1) ─── (N) LoanMaster
       │
       └─── (N) Reservation
       │
       └─── (N) BookRating
```

### 인덱스 권장사항
```sql
-- BookSkuMaster
CREATE INDEX idx_book_isbn ON book_sku_master(isbn);
CREATE INDEX idx_book_title ON book_sku_master(title);
CREATE INDEX idx_book_author ON book_sku_master(author);

-- LoanMaster
CREATE INDEX idx_loan_user_id ON loan_master(user_id);
CREATE INDEX idx_loan_date ON loan_master(loan_date);
CREATE INDEX idx_loan_status ON loan_master(status);

-- Reservation
CREATE INDEX idx_reservation_user_id ON reservation(user_id);
CREATE INDEX idx_reservation_book_id ON reservation(book_sku_id);
CREATE INDEX idx_reservation_date ON reservation(reservation_date);

-- BookRating
CREATE INDEX idx_rating_book_id ON book_rating(book_sku_id);
CREATE INDEX idx_rating_isbn ON book_rating(book_isbn);
CREATE INDEX idx_rating_created ON book_rating(created_at);
```

---

## ⚠️ 에러 응답 형식

모든 에러는 다음 형식으로 반환:

```json
{
  "code": "BOOK_NOT_FOUND",
  "message": "해당 ISBN의 도서를 찾을 수 없습니다.",
  "timestamp": "2024-02-12T14:30:00Z"
}
```

### 공통 에러 코드

| HTTP | Code | 설명 |
|------|------|------|
| 400 | `INVALID_REQUEST` | 요청 형식 오류 |
| 400 | `DATE_RANGE_EXCEEDED` | 날짜 범위 초과 (180일) |
| 400 | `DUPLICATE_RESERVATION` | 중복 예약 |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `BOOK_NOT_FOUND` | 도서 없음 |
| 404 | `USER_NOT_FOUND` | 사용자 없음 |
| 409 | `ISBN_DUPLICATE` | ISBN 중복 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

---

## 🧪 테스트 데이터

Mock 데이터가 `/public/mock/`에 준비되어 있습니다.
백엔드 개발 시 참고하여 동일한 형식으로 응답해주세요.

---

## 📞 문의

프론트엔드 담당: [...]
백엔드 담당: [...]

API 명세 관련 질문은 Slack #library-api 채널로!
