package com.hasterapi.auth.infra.jpa

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("blocked_tokens")
data class BlockedTokenEntity(
    @Id val jti: String,
    val expiresAt: java.time.LocalDateTime
)
/*
-- UNLOGGED 테이블로 생성
CREATE UNLOGGED TABLE blocked_tokens
(
    jti        VARCHAR(255) PRIMARY KEY,
    blocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL -- 토큰 만료 시간 이후에는 이 테이블에서 자동 삭제(Cleanup) 용도
);

-- 기존 auth_history 테이블도 성능을 위해 인덱스 추가 (필요시)
-- CREATE INDEX idx_auth_history_auth_id ON auth_history(auth_id);

 */