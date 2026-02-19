interface ApiConfig {
    url: string;
    description: string;
}

export const API_MAP: ApiConfig[] = [
    // ==================== [Admin Domain] ====================
    {url: '/api/library/v0/admin/books', description: "adminBookSku/도서관 관리자가 책SKU 관리하고, 장서수량, 장서고유ID(UUID)"},
    {url: '/api/library/v0/admin/loans', description: "adminLoans"},
    {url: '/api/library/v0/admin/overdue', description: "adminLoans"},
    {url: '/api/library/v0/admin/reservations', description: "adminReservations"},

    // ==================== [User Domain] ====================
    {url: '/api/library/v0/books', description: "도서검색 혹은 도서"},
    {url: '/api/library/v0/hot-books', description: "지금 가장 인기있는 도서"},
    {url: '/api/library/v0/loans', description: "나의 대출내역 데이터"},
    {url: '/api/library/v0/reservations', description: "나의 대출 예약 내역"},
    {url: '/api/library/v0/review', description: "유저 독서평/리뷰"},


    // 고민이 필요함
    {url: '/api/library/v0/tbd', description: "1시간단위, 30분단위 레이팅 실시간랭킹 의미한건데 데이터부터 다시 다 뜯어고쳐야함"},

];
