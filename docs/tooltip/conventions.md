# 코드 컨벤션

## 패키지 구조
계층별이 아니라 **도메인별**로 나눈다.

```
com.imwebassign
├── product/    각 도메인 내부에 controller, service, repository, entity
├── coupon/
├── order/
├── payment/
└── common/     예외, 응답 포맷, 설정
```

## 계층 책임
- **Controller** — HTTP 파싱, REST 라우트(`/api/v1/{도메인}/...`, kebab-case), DTO 검증, 응답 매핑
  - DTO는 `data class` + `val`. 이며, 접미사는 ~Request(백엔드가 요청받는 DTO), ~Response(백엔드가 응답해주는 DTO) 클래스명 규칙을 갖는다
- **Service** — 비즈니스 로직, `@Transactional` 경계, 서비스는 작업의 순서를 결정한다
- **Repository** — Spring Data JPA 인터페이스
- 도메인계층 : 도메인(엔티티 클래스) 를 도메인 클래스로 정한다. 핵심로직은 도메인계층에 위치해야한다.
  - 도메인계층에는 단위테스트가 존재해야한다.

## Kotlin
기본은 불변 `val`, non-null 타입, 스마트 캐스트.
DTO, 서비스 파라미터, 정책 객체, 테스트 픽스처는 `data class` + `val`.

## JPA 엔티티 — 위 "불변 `val`" 규칙의 유일한 예외
- **엔티티에 `data class`를 쓰지 않는다.** 생성된 equals/hashCode/copy가 지연 로딩 프록시와
  persist 전 null ID에서 깨진다. 일반 `class`를 쓴다.
- 가변 상태는 `var` + `protected set` / `private set`.
  공개 setter 대신 도메인 메서드로 의도를 드러낸다 (`order.cancel()`).
- ID는 `@Id @GeneratedValue var id: Long? = null`. persist 전에 non-null로 취급하지 않는다.
- **모든** `@ManyToOne` / `@OneToOne`에 `fetch = FetchType.LAZY`를 명시한다.
  JPA 기본값은 EAGER이고 N+1을 만든다.
- 단방향 관계가 기본. 쿼리가 필요할 때만 역방향을 추가한다.
- 값 객체(Money, DiscountRate)는 `data class` + `@Embeddable` 권장.
- `@Entity`, `@MappedSuperclass`, `@Embeddable`은 `allOpen` 적용됨.
- N+1 회피는 fetch join 또는 entity graph로.

## 트랜잭션
- `@Transactional`은 **서비스 계층에만**. 컨트롤러·리포지토리에 붙이지 않는다.
- 조회는 `@Transactional(readOnly = true)`.
- **트랜잭션 안에서 외부 I/O 금지.** PG 시뮬레이션 호출은 트랜잭션 밖.
  주문 상태는 `PENDING → PAID | FAILED`로 관리한다.
- 자기 호출(self-invocation)은 프록시를 타지 않는다. 별도 트랜잭션이 필요하면 다른 빈으로 분리한다.
- 트랜잭션은 짧게. 락을 쥔 상태에서 계산·검증하지 않는다.

## 동시성
- 재고 차감은 DB 레벨 원자적 연산으로 한다.
  `UPDATE ... SET stock = stock - :qty WHERE id = :id AND stock >= :qty` 실행 후 affected rows를 검사한다.
  `findById → stock -= qty → save()` 패턴은 **금지**.
- 여러 행에 락을 걸 때는 ID 정렬 순으로 획득해 데드락을 피한다.
- 쿠폰도 경합 자원이다. 중복 사용은 애플리케이션 레벨 체크가 아니라
  **DB 유니크 제약 또는 상태 조건부 업데이트**로 막는다.
- 최후 방어선으로 DB `CHECK (stock >= 0)` 제약을 둔다.

## 금액
- 금액은 `Long` (원 단위). `Double` / `Float` 금지.
- 할인율은 `BigDecimal`. 부동소수점 금지.
- 반올림은 한 곳에서만 적용하고 README에 명시한다. 기본은 원 단위 절사(`RoundingMode.DOWN`).
- 서비스 시그니처에 raw `Long`을 넘기지 말고 `Money` 값 객체로 감싼다.

## 에러 처리
- `@RestControllerAdvice`로 중앙 집중 처리.
- 구조화된 JSON 에러 응답 + 적절한 상태 코드.
- 재고 부족, 쿠폰 중복 사용 등 경합 실패는 `409 Conflict`.

## 과잉 설계 금지
명시적 요청 없이 추가하지 않는다.
- Swagger/OpenAPI, Actuator, Spring Security 스타터, 캐시, 비동기·이벤트 인프라
- 구현체가 하나뿐인 추상 클래스·인터페이스
- 실제로 쓰이지 않는 `BaseService` / `CommonResponse` 류의 골격 코드

추상화는 과제가 명시한 확장 지점(쿠폰 정책, PG 연동)에서만 정당하다. 그 외에는 구체적인 편이 낫다.

## 언어
- 코드, 식별자, 커밋 타입: 영어
- 커밋 제목, 테스트명, README, 도메인 정책 주석: 한국어
