// ===== Common Types =====

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface DateRangeFilter {
  startDate: string; // ISO format
  endDate: string; // ISO format
}

// ===== Domain Models =====

// Book SKU Master
export interface BookSkuMaster {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  callNumber: string; // 청구기호
  category: string;
  description?: string;
  coverImageUrl?: string;
  totalCopies: number; // 총 보유 권수
  availableCopies: number; // 대출 가능 권수
  createdAt: string;
  updatedAt: string;
}

// Book Inventory Detail
export interface BookInventoryDetail {
  id: number;
  bookSkuId: number;
  barcode: string;
  status: 'AVAILABLE' | 'LOANED' | 'MAINTENANCE' | 'LOST';
  location: string;
  acquiredDate: string;
  createdAt: string;
  updatedAt: string;
}

// Loan Master
export interface LoanMaster {
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
}

// Loan Detail
export interface LoanDetail {
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

// Reservation
export const BOOK_RESERVATION_STATUSES = ['예약대기', '예약대출가능', '예약취소', '대출됨'] as const;
export type BookReservationStatus = typeof BOOK_RESERVATION_STATUSES[number];

export interface Reservation {
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
  status: BookReservationStatus;
  queuePosition?: number; // 예약 순번
  createdAt: string;
  updatedAt: string;
}

// Loan Overdue
export interface LoanOverdue {
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
  fineAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// Book Rating
export interface BookRating {
  id: number;
  bookSkuId: number;
  bookIsbn: string;
  bookTitle: string;
  userId: number;
  userName: string;
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookRatingStats {
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

// User Master
export interface UserMaster {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

// ===== Search & Filter Types =====

export const SEARCH_TYPES = ['전체', '도서명', '저자'] as const;
export type SearchType = typeof SEARCH_TYPES[number];

export interface BookSearchParams {
  keyword: string;
  searchType: SearchType;
  page: number;
  pageSize: number;
}

export interface BookSearchResult extends BookSkuMaster {
  status: '대출가능' | '대출불가';
  statusDetail?: '대출중' | '정비중';
  reservationCount?: number;
  expectedReturnDate?: string;
}

// ===== Ranking Types =====

export const RANKING_PERIODS = ['1시간', '10시간', '7일', '30일'] as const;
export type RankingPeriod = typeof RANKING_PERIODS[number];

export interface RankingBook {
  rank: number;
  bookSkuId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
  ratingCount: number;
  ratingCountChange?: number; // 순위 변동
  averageRating?: number;
}

// ===== Hot Ranking Filter =====

export const GENDERS = ['전체', '남', '여', '미상'] as const;
export type Gender = typeof GENDERS[number];

export const AGE_GROUPS = [
  '전체',
  '영유아(0~5세)',
  '유아(6~7세)',
  '1,2학년(8~9세)',
  '3,4학년(10~11세)',
  '5,6학년(12~13세)',
  '중등(14~16세)',
  '고등(17~19세)',
  '20대',
  '30대',
  '40대',
  '50대',
  '60세 이상',
  '미상'
] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

export const REGIONS = [
  '전체',
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주'
] as const;
export type Region = typeof REGIONS[number];

export const SUBJECTS = [
  '전체',
  '총류',
  '철학',
  '종교',
  '사회과학',
  '자연과학',
  '기술과학',
  '예술',
  '언어',
  '문학',
  '역사'
] as const;
export type Subject = typeof SUBJECTS[number];

export interface HotRankingParams {
  gender: Gender;
  ageGroup: AgeGroup;
  region: Region;
  subject: Subject;
}

export interface HotRankingBook {
  rank: number;
  bookSkuId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
  hotScore: number; // 핫 랭킹 점수
  averageRating: number;
  totalRatings: number;
}
