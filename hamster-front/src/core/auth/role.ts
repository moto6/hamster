// ── RBAC 역할 ────────────────────────────────────────────────────────────────
// USER = 일반 사용자, MANAGER = 스코프된 관리자, SUPER_ADMIN = 전권.
export type Role = 'USER' | 'MANAGER' | 'SUPER_ADMIN';

// 역할 표시명 (화면에서 라벨로 사용)
export const ROLE_LABEL: Record<Role, string> = {
    USER: '사용자',
    MANAGER: '매니저',
    SUPER_ADMIN: '슈퍼관리자',
};
