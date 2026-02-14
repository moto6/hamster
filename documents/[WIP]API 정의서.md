# Library Management System - API Documentation

## 📚 Book SKU Management APIs

### 1. Get Book SKU List
**GET** `/book/sku`

**Query Parameters:**
- `keyword` (optional): 검색 키워드 (도서명, ISBN, 저자)
- `category` (optional): 도서 분류
- `page` (required): 페이지 번호 (0-based)
- `pageSize` (required): 페이지 크기

**Response:**
```typescript
interface Response {
  content: BookSkuMaster[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface BookSkuMaster {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  callNumber: string;  // 청구기호
  category: string;
  description?: string;
  coverImageUrl?: string;
  totalCopies: number;  // 총 보유 권수
  availableCopies: number;  // 대출 가능 권수
  createdAt: string;
  updatedAt: string;
}
```

### 2. Create Book SKU
**POST** `/book/sku`

**Request Body:**
```typescript
interface CreateBookSkuRequest {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  callNumber: string;
  category: string;
  description?: string;
  coverImageUrl?: string;
  totalCopies: number;
}
```

**Response:** `BookSkuMaster`

### 3. Update Book SKU
**PUT** `/book/sku/{id}`

**Path Parameters:**
- `id`: Book SKU ID

**Request Body:** `Partial<CreateBookSkuRequest>`

**Response:** `BookSkuMaster`

### 4. Delete Book SKU
**DELETE** `/book/sku/{id}`

**Path Parameters:**
- `id`: Book SKU ID

**Response:** 204 No Content

---

## 📖 Loan Management APIs

### 5. Get Admin Loan History
**GET** `/loan/admin`

**Query Parameters:**
- `searchType` (required): `'유저명'` | `'도서명'`
- `keyword` (optional): 검색어
- `startDate` (required): 시작일 (ISO format)
- `endDate` (required): 종료일 (ISO format)
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Validation:**
- 기본 조회 기간: 최근 30일
- 최대 조회 기간: 180일

**Response:**
```typescript
interface Response {
  content: LoanMasterWithDetails[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface LoanMasterWithDetails {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  details: LoanDetail[];
}

interface LoanDetail {
  id: number;
  loanMasterId: number;
  bookSkuId: number;
  inventoryId: number;
  bookTitle: string;
  bookIsbn: string;
  callNumber: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
}
```

### 6. Get My Loan History (User)
**GET** `/loan/my`

**Query Parameters:**
- `startDate` (required): 시작일 (ISO format)
- `endDate` (required): 종료일 (ISO format)
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Validation:**
- 기본 조회 기간: 최근 30일
- 최대 조회 기간: 180일

**Response:** Same as `/loan/admin` but filtered by current user

---

## 📅 Reservation Management APIs

### 7. Get Admin Reservation List
**GET** `/reservation/admin`

**Query Parameters:**
- `startDate` (required): 시작일 (ISO format) - 기본 지난 7일
- `endDate` (required): 종료일 (ISO format)
- `userEmail` (optional): 사용자 이메일
- `bookTitle` (optional): 도서명
- `isbn` (optional): 도서 ISBN
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Validation:**
- 최대 조회 기간: 180일

**Response:**
```typescript
interface Response {
  content: Reservation[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface Reservation {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  bookSkuId: number;
  bookTitle: string;
  bookIsbn: string;
  reservationDate: string;
  availableDate?: string;
  expiryDate?: string;
  status: '예약대기' | '예약대출가능' | '예약취소' | '대출됨';
  queuePosition?: number;  // 예약 순번
  createdAt: string;
  updatedAt: string;
}
```

### 8. Get My Reservations (User)
**GET** `/reservation/my`

**Query Parameters:**
- `startDate` (required): 시작일 (ISO format) - 기본 최근 30일
- `endDate` (required): 종료일 (ISO format)
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Validation:**
- 최대 조회 기간: 180일

**Response:** Same as `/reservation/admin` but filtered by current user

### 9. Create Reservation (User)
**POST** `/reservation`

**Request Body:**
```typescript
interface CreateReservationRequest {
  bookSkuId: number;
}
```

**Response:** `Reservation`

### 10. Cancel Reservation (User)
**DELETE** `/reservation/{id}`

**Path Parameters:**
- `id`: Reservation ID

**Response:** 204 No Content

---

## ⚠️ Overdue Management APIs

### 11. Get Overdue List
**GET** `/overdue`

**Query Parameters:**
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Response:**
```typescript
interface Response {
  content: LoanOverdue[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface LoanOverdue {
  id: number;
  loanDetailId: number;
  userId: number;
  userName: string;
  userEmail: string;
  bookSkuId: number;
  bookTitle: string;
  bookIsbn: string;
  callNumber: string;
  dueDate: string;
  overdueDays: number;
  fineAmount?: number;  // 연체료 (일당 100원)
  createdAt: string;
  updatedAt: string;
}
```

---

## ⭐ Book Rating APIs

### 12. Get Rating List (Admin)
**GET** `/rating`

**Query Parameters:**
- `isbn` (optional): 도서 ISBN
- `bookTitle` (optional): 도서명
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Response:**
```typescript
interface Response {
  content: BookRating[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface BookRating {
  id: number;
  bookSkuId: number;
  bookIsbn: string;
  bookTitle: string;
  userId: number;
  userName: string;
  rating: number;  // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 13. Get Rating Stats by ISBN (User)
**GET** `/rating/view`

**Query Parameters:**
- `isbn` (required): 도서 ISBN

**Response:**
```typescript
interface BookRatingStats {
  bookSkuId: number;
  bookIsbn: string;
  bookTitle: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
}
```

### 14. Register Rating (User)
**POST** `/rating/register`

**Request Body:**
```typescript
interface RegisterRatingRequest {
  isbn: string;  // ISBN 기준으로 도서 찾기
  rating: number;  // 1-5
  review?: string;
}
```

**Response:** `BookRating`

### 15. Update Rating (User)
**PUT** `/rating/{id}`

**Path Parameters:**
- `id`: Rating ID

**Request Body:**
```typescript
interface UpdateRatingRequest {
  rating: number;
  review?: string;
}
```

**Response:** `BookRating`

### 16. Delete Rating (User)
**DELETE** `/rating/{id}`

**Path Parameters:**
- `id`: Rating ID

**Response:** 204 No Content

---

## 🔍 Book Search APIs

### 17. Search Books (User)
**GET** `/book/search`

**Query Parameters:**
- `keyword` (required): 검색 키워드
- `searchType` (required): `'전체'` | `'도서명'` | `'저자'`
- `page` (required): 페이지 번호
- `pageSize` (required): 페이지 크기

**Response:**
```typescript
interface Response {
  content: BookSearchResult[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface BookSearchResult extends BookSkuMaster {
  status: '대출가능' | '대출불가';
  statusDetail?: '대출중' | '정비중';
  reservationCount?: number;  // 예약 인원 수
  expectedReturnDate?: string;  // 반납 예정일
}
```

---

## 📊 Ranking APIs

### 18. Get Realtime Ranking
**GET** `/ranking/realtime`

**Query Parameters:**
- `period` (required): `'1시간'` | `'10시간'` | `'7일'` | `'30일'`

**Response:**
```typescript
interface Response {
  period: RankingPeriod;
  updatedAt: string;
  rankings: RankingBook[];
}

interface RankingBook {
  rank: number;
  bookSkuId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
  ratingCount: number;  // 평점 등록 수
  ratingCountChange?: number;  // 순위 변동
  averageRating?: number;
}
```

### 19. Get Hot Ranking
**GET** `/ranking/hot`

**Query Parameters:**
- `gender` (required): Gender type
- `ageGroup` (required): AgeGroup type
- `region` (required): Region type
- `subject` (required): Subject type

**Filter Types:**
```typescript
type Gender = '전체' | '남' | '여' | '미상';

type AgeGroup = 
  | '전체'
  | '영유아(0~5세)'
  | '유아(6~7세)'
  | '1,2학년(8~9세)'
  | '3,4학년(10~11세)'
  | '5,6학년(12~13세)'
  | '중등(14~16세)'
  | '고등(17~19세)'
  | '20대'
  | '30대'
  | '40대'
  | '50대'
  | '60세 이상'
  | '미상';

type Region = 
  | '전체'
  | '서울' | '부산' | '대구' | '인천'
  | '광주' | '대전' | '울산' | '세종'
  | '경기' | '강원' | '충북' | '충남'
  | '전북' | '전남' | '경북' | '경남'
  | '제주';

type Subject = 
  | '전체'
  | '총류' | '철학' | '종교'
  | '사회과학' | '자연과학' | '기술과학'
  | '예술' | '언어' | '문학' | '역사';
```

**Response:**
```typescript
interface Response {
  rankings: HotRankingBook[];
}

interface HotRankingBook {
  rank: number;
  bookSkuId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
  hotScore: number;  // 핫 랭킹 알고리즘 점수
  averageRating: number;
  totalRatings: number;
}
```

---

## 🔐 Authentication

All APIs require authentication token in the header:
```
Authorization: Bearer {token}
```

Token is stored in `localStorage.getItem('authToken')`

---

## Error Responses

All APIs return standard error format:

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 204: No Content (Delete success)
- 400: Bad Request (Validation error)
- 401: Unauthorized (Auth required)
- 403: Forbidden (Permission denied)
- 404: Not Found
- 500: Internal Server Error
