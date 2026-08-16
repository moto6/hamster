# hamster

사내 도서관 · 회의실(공간) 예약 · 이슈(지라형) 관리를 아우르는 **풀스택 사내 업무 플랫폼**.
인증(SSO/JWT) · 권한(RBAC) · 리액티브 백엔드 · MDI 탭 프론트엔드 골격 위에 실제 도메인 기능이 얹혀 있다.

> 발표자료: [바로가기](./documents/발표자료.md)

---

## 1. 무엇이 들어있나

| 구분 | 내용 |
|------|------|
| 인증 | SSO(OIDC) + Mock IDP(개발용), 자체 JWT(access) + Refresh 토큰 회전/재사용탐지 |
| 권한 | RBAC (`USER` / `MANAGER` / `SUPER_ADMIN`), 프론트 메뉴 게이팅 + 백엔드 강제 |
| 도서관 | 도서 SKU/재고/대출/예약/연체/평점·리뷰·랭킹 (수직 슬라이스) |
| 공간예약 | 건물/회의실/자원/예약/대시보드 |
| 이슈관리 | 지라형 이슈/컴포넌트/릴리즈/리포트 (프론트) |
| 프론트 | MDI 탭 시스템, GNB 단일소스 네비게이션, AuthContext + RBAC 게이팅 |
| 인프라 | Dockerfile(백/프론트), docker-compose, nginx, 프로파일(local/dev/prod), OpenAPI(Swagger UI) |

---

## 2. 전체 구조

```
hamster/
├── hamster-back/                 # Kotlin + Spring Boot 4.1 (멀티모듈, WebFlux + R2DBC)
│   ├── foundation/               #   공유 커널(식별자·값객체·페이지네이션, 스프링 의존 X)
│   ├── iam-core/                 #   계정/사용자 도메인 골격
│   ├── library-core/             #   도서관 도메인 + 유스케이스 계약(포트) + 서비스
│   ├── place-core/               #   공간 예약 도메인
│   ├── hamster-api/              # ★ 실행 앱: 컨트롤러 · R2DBC 어댑터 · 인증(auth/) · 설정
│   └── hamster-batch/            #   배치 잡
│
├── hamster-front/                # React 19 + TypeScript + Vite + Tailwind v4
│   └── src/
│       ├── app/                  #   레이아웃(Header/GNB) · MDI 탭 시스템
│       ├── pages/                #   library/ · place/ · jira/ · auth/ · playground/
│       ├── core/                 #   auth(AuthContext/RequireAuth) · http(axios+refresh) · types
│       └── components/           #   공용 UI
│
├── infra/                        # docker-compose · .env.example · image_build_push.sh
└── documents/                    # 요구사항·설계·구현 문서 + 개발 가이드
```

상세 문서:
- 🏛 [documents/아키텍처-코드.md](documents/아키텍처-코드.md) — 멀티모듈/리액티브/포트·어댑터/인증·RBAC 설계
- 🧩 [documents/추가-개발-가이드.md](documents/추가-개발-가이드.md) — 수직 슬라이스 추가법 + 운영 준비 체크리스트
- 🎨 [documents/프론트엔드-개발-가이드.md](documents/프론트엔드-개발-가이드.md) — 프론트 구조/관례/페이지 추가법
- 📑 [documents/3_구현_인터페이스_RESTAPI.md](documents/3_구현_인터페이스_RESTAPI.md) — REST API 스펙

---

## 3. 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | Kotlin 2.2 · Spring Boot 4.1 · Java 21 · **WebFlux + R2DBC(리액티브/코루틴)** · Flyway · springdoc(OpenAPI) |
| Frontend | React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 · axios · ag-grid · recharts |
| DB | PostgreSQL |
| Auth | SSO(OIDC) / Mock IDP(개발용) · JWT(HS256) + Refresh Token(HttpOnly 쿠키, 회전/재사용탐지) |
| 배포 | Docker + nginx (docker-compose) |

---

## 4. 빠른 시작 (로컬)

### 사전 준비 — PostgreSQL (DB: `library`)
로컬에 `library` DB/유저(`localuser`/`localpass`)가 있다고 가정한다(또는 `infra/docker-compose.yml` 의 postgres 사용).
테이블은 앱 기동 시 Flyway 마이그레이션(`hamster-api/src/main/resources/db/migration`)으로 생성된다.

### 백엔드 (local 프로파일 · Mock IDP)
```bash
cd hamster-back
./gradlew :hamster-api:bootRun --args='--spring.profiles.active=local'   # :8080
```
> 참고: 이 프로젝트는 JDK 21 툴체인을 사용한다. Gradle 실행 JDK 가 25 이상이면 `JAVA_HOME` 을 21로 지정할 것.

### 프론트엔드
```bash
cd hamster-front
npm install
npm run dev    # http://127.0.0.1:5173
```

### 로그인
브라우저에서 `http://127.0.0.1:5173` → 로그인 화면의 **admin.demo**(SUPER_ADMIN) 또는 **user.demo**(USER) 버튼.
(Mock IDP라 외부 SSO 없이 전체 로그인 흐름이 동작한다.)

- OpenAPI(Swagger UI): `http://127.0.0.1:8080/swagger-ui.html`

---

## 5. 인증 · RBAC 요약

```
브라우저 → GET /api/v0/auth/login → (302) IDP → /callback
        → 계정 JIT 프로비저닝 → access(JWT) 발급 + refresh(HttpOnly 쿠키)
        → 프론트가 /api/v0/auth/refresh 로 access 부트스트랩
        → 이후 업무 API 는 Authorization: Bearer, 401 시 /refresh 로 자동 재발급(single-flight)
```

- **IDP 독립**: 인증 코드는 외부 IDP에 의존하지 않음. IDP 교체 = 어댑터 추가 + `auth.idp` 설정만 (`MockIdentityProvider` / `SsoIdentityProvider`).
- **권한 2단**: 프론트는 메뉴 노출만(UX), 실제 보안은 백엔드 `AdminAuthorization.verify()` 에서 강제(403).
- **부트스트랩 슈퍼관리자**: `auth.bootstrap-super-admins` 의 LDAP 은 최초 로그인 시 자동 `SUPER_ADMIN`.
- **리프레시 회전/재사용탐지**: refresh 는 불투명 값(DB엔 SHA-256 해시), 회전 시 기존 폐기, 폐기된 토큰 재사용 시 family 전체 폐기.

자세한 내용은 [documents/아키텍처-코드.md](documents/아키텍처-코드.md).

---

## 6. 환경 / 배포

- 프로파일: `local`(개발자 PC) · `dev`(개발 VM, mock idp) · `prod`(운영, sso idp + HTTPS 쿠키)
- 시크릿은 **반드시 환경변수**로 주입(레포 커밋 금지). 템플릿: [infra/.env.example](infra/.env.example)
- 빌드/이미지: `infra/docker-compose.yml` 로 기동(postgres + hamster-back + hamster-front/nginx).
