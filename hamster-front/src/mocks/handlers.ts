import {delay, http, HttpResponse} from 'msw';

// ----------------------------------------------------------------------
// 1. JSON 데이터 Import
// ----------------------------------------------------------------------
import adminBookSku from './data/books/admin_booksku.json';
import adminLoans from './data/books/admin_loans.json';
import adminReservations from './data/books/admin_reservations.json';
import userSearch from './data/books/user_search.json';
import userHot from './data/books/user_hot.json';
import userRanking from './data/books/user_ranking.json';
import userRating from './data/books/user_rating.json';
import userLoans from './data/books/user_loans.json';
import userReservations from './data/books/user_reservations.json';

interface ApiConfig {
    url: string;
    data: any;
    method?: string;
}

const API_MAP: ApiConfig[] = [
    // ==================== [Admin Domain] ====================
    {url: '/api/v0/admin/books', data: adminBookSku},
    {url: '/api/v0/admin/loans', data: adminLoans}, // ?status=OVERDUE 필터링은 프론트에서 처리하거나 별도 핸들러 작성
    {url: '/api/v0/admin/reservations', data: adminReservations},

    // ==================== [User Domain] ====================
    // 1. 도서 목록
    {url: '/api/v0/books', data: userSearch},
    // 2. 랭킹/추천
    {url: '/api/v0/books/hot', data: userHot},
    {url: '/api/v0/rankings/books', data: userRanking},

    // 3. 내 활동
    {url: '/api/v0/loans', data: userLoans},
    {url: '/api/v0/reservations', data: userReservations},

    // 4. 기타
    {url: '/api/v0/books/:bookId/rating', data: userRating},
];

// ----------------------------------------------------------------------
// 3. 핸들러 (팩토리 패턴 적용)
// ----------------------------------------------------------------------
export const handlers = [
    ...API_MAP.map((config) => {
        const method = config.method || 'get';
        return (http as any)[method](config.url, async () => {
            // 네트워크 지연 시뮬레이션
            await delay(50 + Math.random() * 100);
            return HttpResponse.json(config.data);
        });
    }),

    // --------------------------------------------------------------------
    // 4. (예외) 단순 JSON 리턴으로 안 되는 복잡한 로직 (수동 추가)
    // --------------------------------------------------------------------

    // 예: 도서 등록 (POST) - 성공 응답 흉내
    http.post('/api/v0/admin/books', async ({request}) => {
        await delay(500);
        const newBook = await request.json();

        return HttpResponse.json(
            {id: Date.now(), ...(newBook as object)},
            {status: 201}
        );
    }),
];