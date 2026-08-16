# 백엔드 구현 가이드 — imwebassign

> 이 문서는 **어떻게 만들 것인가**를 정한다. 결정의 근거 중 README에 남길 것은 인용구로 표시했다.
> 여기서 정한 값(필드명, 상태값, 에러코드, JSON 키)은 구현에서 그대로 쓴다. 임의로 바꾸지 않는다.

---

## 0. 패키지 구조

`conventions.md`의 도메인별 분리를 실제 파일로 펼치면 이렇다.

```
com.imwebassign
├── auth/
│   ├── AuthController.kt          POST /api/v1/auth/login
│   ├── AuthService.kt
│   ├── JwtProvider.kt             HS256 발급/검증
│   ├── JwtAuthFilter.kt           OncePerRequestFilter
│   ├── LoginUser.kt               @LoginUser 애노테이션
│   ├── LoginUserArgumentResolver.kt
│   └── User.kt / UserRepository.kt
├── product/
│   ├── ProductController.kt       GET /api/v1/products
│   ├── ProductService.kt
│   ├── ProductRepository.kt       deductStock / restoreStock
│   ├── Product.kt / Category.kt
│   └── dto/
├── coupon/
│   ├── CouponController.kt        GET /api/v1/coupons
│   ├── CouponService.kt
│   ├── Coupon.kt / UserCoupon.kt / DiscountType.kt
│   ├── UserCouponRepository.kt    use / restore
│   ├── policy/                    DiscountPolicy + 구현체 + Registry
│   ├── DiscountCalculator.kt      순수 계산. 스프링 빈이지만 상태 없음
│   └── dto/
├── order/
│   ├── OrderController.kt         POST /api/v1/orders
│   ├── OrderFacade.kt             T1 → PG → T2 오케스트레이션. @Transactional 없음
│   ├── OrderService.kt            prepare(T1) / finalize(T2)
│   ├── Order.kt / OrderItem.kt / OrderCoupon.kt / OrderStatus.kt
│   └── dto/
├── payment/
│   ├── PaymentGateway.kt          인터페이스
│   ├── FakePaymentGateway.kt      시뮬레이터
│   ├── Payment.kt / PaymentStatus.kt
│   └── PaymentRepository.kt
└── common/
    ├── Money.kt                   @Embeddable value object
    ├── ApiExceptionHandler.kt     @RestControllerAdvice
    ├── BusinessException.kt / ErrorCode.kt
    └── config/                    WebMvcConfig
```

**`OrderFacade`를 따로 두는 이유**: T1과 T2는 서로 다른 트랜잭션이어야 한다. 같은 빈 안에서
`prepare()` → `finalize()`를 호출하면 self-invocation이라 프록시를 타지 않고 트랜잭션이 하나로
합쳐지거나 아예 안 걸린다. 트랜잭션이 없는 Facade가 트랜잭션이 있는 Service를 호출하는 구조여야 한다.

---

## 1. 엔티티

**쿠폰 정책과 발급분을 분리한다.** 합치면 같은 쿠폰을 여러 유저에게 발급하는 걸 표현할 수 없고, 중복 사용 방지를 행 단위로 걸 수 없다.

| 엔티티 | 핵심 필드 |
|---|---|
| `User` | email, password |
| `Product` | name, price, stock, category |
| `Coupon` (정책) | discountType(FIXED/PERCENTAGE), value, minOrderAmount, maxDiscountAmount, category, 유효기간 |
| `UserCoupon` (발급분) | userId, couponId, status(AVAILABLE/USED), usedAt, orderId |
| `Order` | userId, status, totalAmount, discountAmount, payAmount, idempotencyKey |
| `OrderItem` | orderId, productId, quantity, **unitPrice** |
| `OrderCoupon` | orderId, userCouponId, appliedAmount |
| `Payment` | orderId, status, pgTransactionId |

- `Category`는 enum. 테이블로 빼면 조인만 늘고 얻는 게 없다.
- `OrderItem.unitPrice`는 주문 시점 가격을 **복사 저장**한다. 상품 가격이 바뀌어도 주문 금액이 흔들리면 안 된다.

### 1-1. 세부 결정

**연관관계는 ID 참조를 기본으로 한다.**
`OrderItem.productId: Long`이지 `Order Item.product: Product`가 아니다.
- 이유 1: 재고 차감을 조건부 UPDATE로 하는 이상 `Product` 엔티티를 영속성 컨텍스트에 올릴 이유가 없다.
  올려두면 flush 시점에 dirty checking이 개입해 방금 UPDATE한 stock을 예전 값으로 덮어쓸 수 있다.
- 이유 2: 애그리거트 경계를 넘는 참조를 객체로 들고 있으면 LAZY 프록시·N+1·의도치 않은 cascade가 붙는다.
- 예외: `Order` ↔ `OrderItem`/`OrderCoupon`은 같은 애그리거트다.
  `@OneToMany(cascade = ALL, orphanRemoval = true)` 단방향으로 묶는다.

**enum은 `@Enumerated(EnumType.STRING)`.** ORDINAL은 enum 상수 순서를 바꾸는 순간 과거 데이터가 전부 뒤틀린다.

**`Money` 값 객체.**
```kotlin
@Embeddable
data class Money(val amount: Long) : Comparable<Money> {
    init { require(amount >= 0) { "금액은 음수일 수 없다: $amount" } }
    operator fun plus(o: Money) = Money(amount + o.amount)
    operator fun minus(o: Money) = Money((amount - o.amount).coerceAtLeast(0))
    operator fun times(qty: Int) = Money(amount * qty)
    override fun compareTo(other: Money) = amount.compareTo(other.amount)
    companion object { val ZERO = Money(0) }
}
```
- 엔티티 필드·서비스 시그니처·DTO 내부는 `Money`. **JSON 직렬화는 숫자**(`@JsonValue` 또는 DTO에서 `.amount`).
  응답 스펙이 `{"price": {"amount": 1000}}`이 되면 안 된다.
- 네이티브 쿼리 파라미터는 raw `Long`. 값 객체가 SQL 경계를 넘지 않는다.
- `minus`가 0에서 clamp되는 건 의도적이다. 할인이 원금을 넘는 경우가 정상 시나리오다.

**시각 타입은 `Instant`.** `LocalDateTime`은 타임존이 없어 서버 로케일에 따라 쿠폰 만료 판정이 달라진다.
DB는 `TIMESTAMPTZ`. 생성/수정 시각은 `BaseTimeEntity`(`@MappedSuperclass`)로 뽑되,
`@EnableJpaAuditing` 없이 `@PrePersist`/`@PreUpdate`로 직접 채운다 — 설정 클래스 하나를 아낀다.

**상태값 정의.**

| enum | 값 | 전이 |
|---|---|---|
| `OrderStatus` | `PENDING` → `PAID` \| `FAILED` | 종결 상태에서 전이 없음 |
| `ProductCategory` | `AVAILABLE` ↔ `USED` | 복원은 T2 실패 시에만 |
| `PaymentStatus` | `APPROVED` \| `DECLINED` \| `ERROR` | 시도 결과 기록. 전이 없음 |
| `DiscountType` | `FIXED` \| `PERCENTAGE` | |
| `Category` | `FASHION` \| `DIGITAL` \| `FOOD` \| `LIVING` | 시드 기준 |

---

## 2. 결제 흐름 — 이 과제의 핵심

과제 문구는 "결제가 완료되면 재고 차감"이지만, 그대로 구현하면 PG 호출이 트랜잭션 안에 들어가거나 오버셀이 난다.
**선점 → 외부 호출 → 확정** 3단계로 쪼갠다.

```
T1 (트랜잭션)
  재고 선점 (조건부 UPDATE)
  쿠폰 선점 (조건부 UPDATE)
  Order 생성 → status = PENDING
  commit

PG 호출  ← 트랜잭션 밖

T2 (트랜잭션)
  성공 → Order.status = PAID, Payment 저장
  실패 → 재고 복원 + 쿠폰 복원, Order.status = FAILED
```

```kotlin
fun pay(command: PayCommand): PayResult {
    val order = orderService.prepare(command)        // T1
    val result = paymentGateway.pay(order.toRequest()) // 트랜잭션 밖
    return orderService.finalize(order.id, result)    // T2
}
```

> **README에 쓸 근거:** 단일 트랜잭션으로 묶지 않은 이유는 외부 호출의 지연이 그대로 DB 락 보유 시간이 되고, 타임아웃 시 "결제는 성공했으나 재고는 미차감" 상태를 만들 수 있기 때문이다.

### 2-1. T1 내부 순서

순서가 정합성을 좌우한다. 검증은 락 밖에서, 선점은 짧게.

```
1. 멱등 키 조회 → 기존 주문 있으면 즉시 반환 (아래 §9)
2. 상품 조회 (읽기 전용, 락 없음) → 존재/판매중 검증, unitPrice 스냅샷
3. 쿠폰 조회 → 소유권·유효기간·최소구매금액·카테고리 검증 (§4)
4. 할인 계산 → totalAmount / discountAmount / payAmount 확정  ← 순수 계산, 락 없음
5. 재고 선점  : productId 오름차순 조건부 UPDATE
6. 쿠폰 선점  : userCouponId 오름차순 조건부 UPDATE
7. Order + OrderItem + OrderCoupon insert (status=PENDING)
```

- **계산(4)을 선점(5·6) 앞에 둔다.** 락을 쥔 상태에서 BigDecimal 계산과 검증을 돌리면 락 보유 구간이 늘어난다.
- 4번에서 읽은 가격과 7번에 저장하는 `unitPrice`는 같은 값이다. 그 사이 관리자가 가격을 바꿔도
  **이미 계산된 주문 금액을 따른다.** 가격 변경은 재고와 달리 경합 자원이 아니므로 락을 걸지 않는다.
- 5·6번 중 하나라도 affected rows가 0이면 예외 → T1 전체 롤백. 이미 성공한 선점도 함께 되돌아간다.

### 2-2. T2 실패 경로

```kotlin
@Transactional
fun finalize(orderId: Long, result: PaymentResult): PayResult {
    val order = orderRepository.findByIdWithItems(orderId)
    if (order.status != PENDING) return order.toResult()   // 재진입 방어

    paymentRepository.save(Payment.of(order, result))       // 성공/실패 모두 기록
    if (result.isApproved) {
        order.markPaid()
    } else {
        restoreStock(order)      // productId 오름차순
        restoreCoupons(order)    // userCouponId 오름차순
        order.markFailed(result.reason)
    }
    return order.toResult()
}
```

- **복원도 조건부 UPDATE다.** `WHERE id = :id AND order_id = :orderId` 를 걸어 두 번 복원되는 걸 막는다.
- **실패한 결제도 `Payment` 행을 남긴다.** 시도 이력이 없으면 PG와 대사(reconciliation)가 불가능하다.
- PG 호출이 예외/타임아웃으로 끝나면 결과를 알 수 없다. `PaymentStatus.ERROR`로 기록하고
  **실패와 동일하게 복원**한다.
  > **README에 쓸 근거:** 실제 PG라면 여기서 조회 API로 최종 상태를 확인해야 한다.
  > 결과를 모르는 채 복원하면 "PG는 승인, 우리는 취소" 상태가 될 수 있다. 과제 범위상 시뮬레이터는
  > 결정적으로 동작하므로 복원으로 단순화하고, 실서비스에서는 상태 조회 + 대사 배치가 필요하다고 명시한다.
- **T2 자체가 죽으면 주문은 `PENDING`으로 남는다.** 재고·쿠폰이 선점된 채 고아가 된다.
  이걸 정리하는 배치는 구현하지 않는다(§10 제외 항목). 한계로 README에 적는다.

---

## 3. 재고 차감

조건부 UPDATE 한 문장. affected rows를 검사한다.

```kotlin
@Modifying
@Query("""
    UPDATE product SET stock = stock - :qty
    WHERE id = :id AND stock >= :qty
""", nativeQuery = true)
fun deductStock(id: Long, qty: Int): Int
```

```kotlin
// 다건 주문은 ID 오름차순 정렬 후 실행 → 데드락 회피
items.sortedBy { it.productId }.forEach {
    val affected = productRepository.deductStock(it.productId, it.quantity)
    if (affected == 0) throw OutOfStockException(it.productId)  // 409
}
```

- `findById → stock -= qty → save()` 패턴 **금지**. Lost Update가 난다.
- 테이블에 `CHECK (stock >= 0)` 을 최후 방어선으로 건다.
- **부분 실패는 전체 실패로.** 3개 중 1개가 부족하면 주문 전체 롤백. 사용자가 의도한 주문 구성을 서버가 임의로 바꾸면 안 된다.

**왜 다른 방식이 아닌가 (README용)**

| 방식 | 배제 사유 |
|---|---|
| 비관적 락 (`SELECT FOR UPDATE`) | 락 보유 구간이 길어 처리량 저하 |
| 낙관적 락 (`@Version`) | 재고는 충돌이 잦은 hot row라 재시도 폭증 |
| 조건부 UPDATE ✅ | DB가 행 락을 문장 단위로만 잡음 |

### 3-1. 세부 결정

**`@Modifying(clearAutomatically = true, flushAutomatically = true)` 를 붙인다.**
붙이지 않으면 같은 트랜잭션 안에서 그 전에 읽어둔 `Product` 엔티티가 1차 캐시에 남아
차감 후 재고를 옛날 값으로 읽는다. 응답에 "차감 후 재고"를 내려야 하므로 이건 바로 버그가 된다.

**차감 후 재고는 UPDATE 이후 다시 조회해서 응답에 담는다.**
`읽은 값 - 주문 수량`으로 계산하면 다른 트랜잭션이 그 사이 차감한 분량이 반영되지 않아 거짓말이 된다.

**같은 상품을 요청 배열에 두 번 넣은 경우** — `[{p:1,qty:2},{p:1,qty:3}]` —
요청 파싱 단계에서 productId로 병합해 `qty:5` 한 건으로 만든다. 병합하지 않으면 정렬 후 실행해도
같은 행을 두 번 UPDATE하게 되고, 부분 성공(2는 되고 3은 실패)이라는 판정하기 애매한 상태가 생긴다.

**수량 상한.** `quantity`는 1 이상 999 이하. 주문 항목 수는 최대 50. 없으면 한 요청으로 전 재고를 쓸어담을 수 있다.

**`restoreStock`은 조건 없는 덧셈이다.**
```sql
UPDATE product SET stock = stock + :qty WHERE id = :id
```
`CHECK (stock >= 0)`이 걸려 있으므로 상한 검증은 하지 않는다. 복원이 실패할 이유가 없어야 한다.

---

## 4. 쿠폰 계산

정할 건 세 가지뿐이다.

**① 적용 순서: 정률 → 정액**
정액을 먼저 빼면 정률이 계산될 원금이 줄어 총 할인액이 작아진다.

```
100,000원 / 10% 쿠폰 + 10,000원 쿠폰
  정률 먼저: 100,000 → 90,000 → 80,000  (할인 20,000)  ✅ 고객 유리
  정액 먼저: 100,000 → 90,000 → 81,000  (할인 19,000)
```

**② 최소 구매 금액 판정은 주문 원금 기준으로 통일**
직전 단계 금액 기준으로 하면 앞 쿠폰이 금액을 깎아 뒤 쿠폰이 조건 미달이 되고, **적용 순서에 따라 사용 가능 여부가 바뀐다.** 원금 기준이면 순서와 무관하게 판정돼 검증과 계산을 분리할 수 있다.

**③ 카테고리 제한 쿠폰은 해당 카테고리 상품 금액 합계에만 적용**
정액 쿠폰이 대상 금액보다 크면 대상 금액까지만. 최종 결제 금액은 0 미만으로 내려가지 않게 clamp.

```kotlin
// 금액 Long(원 단위), 할인율 BigDecimal, 절사는 한 곳에서만
val discount = targetAmount.toBigDecimal()
    .multiply(rate)
    .setScale(0, RoundingMode.DOWN)
    .toLong()
    .coerceAtMost(maxDiscountAmount)
```

**중복 사용 방지 — 재고와 동일한 방식**

```sql
UPDATE user_coupon SET status = 'USED', order_id = :orderId
WHERE id = :id AND status = 'AVAILABLE'
```

affected rows 0이면 이미 사용됨. `order_coupon(user_coupon_id)`에 유니크 제약으로 이중 방어.

### 4-1. 계산 알고리즘 확정

위 세 원칙만으로는 "카테고리 쿠폰 두 장이 겹칠 때 대상 금액이 어떻게 되는가"가 안 정해진다. 아래로 확정한다.

```
검증 단계 (순서 무관, 원금 기준)
  각 쿠폰에 대해:
    - 소유자가 요청자인가                      아니면 403
    - status == AVAILABLE 인가                아니면 409
    - now 가 유효기간 안인가                   아니면 400
    - 주문 원금(totalAmount) >= minOrderAmount 아니면 400
    - 카테고리 쿠폰이면 해당 카테고리 상품이 주문에 있는가  아니면 400

계산 단계 (정렬 순서대로 순차 적용)
  remaining = totalAmount            // 남은 결제 금액
  for coupon in sorted(coupons):
    base   = 카테고리 쿠폰 ? 해당 카테고리 상품 금액 합 : totalAmount   // 원금 기준
    target = min(base, remaining)                                    // 남은 금액을 넘길 수 없다
    d      = policy.calculate(target, coupon)
    d      = min(d, remaining)
    remaining -= d
    appliedAmount[coupon] = d        // 0원이어도 OrderCoupon 행은 남긴다

  discountAmount = totalAmount - remaining
  payAmount      = remaining         // 0 이상 보장
```

- **`base`는 원금, `target`은 `min(base, remaining)`.** 최소구매금액 판정만 순수 원금 기준이고,
  실제 할인 대상은 남은 금액으로 눌린다. 그래야 할인 합계가 원금을 넘지 않는다.
- **절사는 `policy.calculate` 안에서 딱 한 번.** 바깥에서 다시 반올림하지 않는다.
- **할인액이 0원으로 계산돼도 쿠폰은 사용 처리한다.** 사용자가 명시적으로 적용을 요청했고,
  서버가 "손해니까 안 쓴 걸로 해드릴게요"라고 판단하면 예측 불가능해진다.
  응답에 `appliedAmount: 0`이 그대로 보이므로 사용자가 판단할 수 있다.

**정렬 규칙 (완전 결정적)**

```kotlin
coupons.sortedWith(
    compareBy<AppliedCoupon> { it.discountType.order }   // PERCENTAGE=0, FIXED=1
        .thenByDescending { it.estimatedDiscount }        // 큰 할인 먼저
        .thenBy { it.userCouponId }                       // 최종 tie-break
)
```
정률끼리 겹칠 때 순서에 따라 총액이 달라지므로 tie-break까지 못 박는다.
같은 입력이면 항상 같은 결과가 나와야 테스트가 성립한다.

**중복 지정 방어.** 요청 배열에 같은 `userCouponId`가 두 번 오면 `400`. 조용히 dedup하지 않는다.
쿠폰 개수 상한은 주문당 5장.

### 4-2. 확장 지점으로서의 `DiscountPolicy`

```kotlin
interface DiscountPolicy {
    val type: DiscountType
    fun calculate(target: Money, coupon: Coupon): Money
}

@Component
class PercentageDiscountPolicy : DiscountPolicy {
    override val type = DiscountType.PERCENTAGE
    override fun calculate(target: Money, coupon: Coupon): Money =
        Money(
            target.amount.toBigDecimal()
                .multiply(coupon.value)             // 0.10 형태로 저장
                .setScale(0, RoundingMode.DOWN)
                .toLong()
        ).coerceAtMost(coupon.maxDiscountAmount ?: target)
         .coerceAtMost(target)
}

@Component
class FixedAmountDiscountPolicy : DiscountPolicy {
    override val type = DiscountType.FIXED
    override fun calculate(target: Money, coupon: Coupon): Money =
        Money(coupon.value.toLong()).coerceAtMost(target)
}

@Component
class DiscountPolicies(policies: List<DiscountPolicy>) {
    private val byType = policies.associateBy { it.type }
    fun of(type: DiscountType) = byType[type] ?: error("정책 없음: $type")
}
```

**새 쿠폰 타입 추가 = enum 상수 하나 + `@Component` 하나.** 계산기·서비스·컨트롤러는 손대지 않는다.
이게 과제가 말한 "쿠폰 정책 확장"의 구체적 증거다. README에 이 문단을 그대로 옮긴다.

`Coupon.value`는 `BigDecimal` 하나로 두 타입을 겸한다 — `FIXED`면 원 단위 금액, `PERCENTAGE`면 비율(0.10).
칼럼을 둘로 나누면 항상 한쪽이 null이라 더 나쁘다. 대신 **엔티티 생성자에서 타입별 범위를 검증**한다
(`PERCENTAGE`는 0 초과 1 이하, `FIXED`는 정수이고 0 초과).

### 4-3. 목록 조회의 "사용 가능 여부"

```kotlin
val usable = status == AVAILABLE && now in validFrom..validUntil
```
`status`만 보고 내려주면 만료된 쿠폰이 "사용 가능"으로 표시된다. 요구사항 명시 필드이므로 유효기간을 반영한다.
`usableReason` 같은 필드는 만들지 않는다 — 목록 API에는 주문 컨텍스트가 없어 최소구매금액 충족 여부를 알 수 없다.
최소구매금액·최대할인액·적용 카테고리는 값 그대로 내려주고 판단은 클라이언트에 맡긴다.

---

## 5. 확장 지점 — 인터페이스는 두 개만

과제가 명시한 확장 지점에만 추상화를 둔다. 그 외에는 구체 클래스가 낫다.

```kotlin
interface DiscountPolicy {
    fun calculate(orderAmount: Long, targetAmount: Long): Long
}
// FixedAmountPolicy, PercentagePolicy → 새 쿠폰 타입은 구현체 추가만

interface PaymentGateway {
    fun pay(request: PaymentRequest): PaymentResult
}
// FakePaymentGateway: 항상 성공. 테스트에서 실패 주입 → T2 복원 경로 검증
```

포인트는 구현하지 않는다. README에 "별도 차감 수단으로 `PaymentMethod` 추상화를 추가하면 된다" 한 줄만.

### 5-1. `PaymentGatewayPort` 계약

```kotlin
data class PaymentRequest(
    val orderId: Long,
    val amount: Money,
    val idempotencyKey: String,    // PG에도 그대로 전달. 재시도 시 이중 승인 방지
)

sealed interface PaymentResult {
    data class Approved(val pgTransactionId: String) : PaymentResult
    data class Declined(val reason: String) : PaymentResult
    data class Error(val reason: String) : PaymentResult   // 타임아웃·통신 실패 = 결과 불명
}
```

- `sealed interface`로 두면 `when`이 exhaustive해져서 나중에 결과 종류가 늘어날 때 컴파일러가 누락을 잡는다.
- **`PaymentGatewayMockAdaptor`는 기본 승인.** 실패 주입은 테스트에서 `@TestConfiguration`으로 스텁을 갈아끼운다.
  프로덕션 코드에 `if (amount == 13000L) fail` 같은 테스트용 분기를 넣지 않는다.
- **`Thread.sleep`으로 지연을 흉내내지 않는다.** 동시성 테스트 시간만 늘어난다.
- 이 인터페이스가 트랜잭션 밖에서 호출된다는 사실은 `OrderFacade`에 주석 한 줄로 못 박는다.

---

## 6. 인증

JWT HS256, 로그인 API 하나. 회원가입은 시드 데이터로 대체하고 README에 명시.
`OncePerRequestFilter`에서 토큰 파싱 → `userId` 추출 → 커스텀 `ArgumentResolver`로 컨트롤러에 주입.

**Spring Security 스타터는 넣지 않는다.** 필터 하나로 끝날 일에 설정 클래스가 딸려오고 리뷰 면적만 넓어진다.

### 6-1. 세부 결정

**JWT 라이브러리도 추가하지 않는다.** `javax.crypto.Mac`(HmacSHA256) + `java.util.Base64`로 40줄이면 끝난다.
의존성 추가 금지 규칙과 충돌하지 않고, 서명 검증 로직이 눈에 보이는 게 리뷰에 유리하다.

```kotlin
// 검증 시 서명 비교는 MessageDigest.isEqual — 상수 시간 비교로 타이밍 공격 회피
// 클레임: { "sub": "<userId>", "iat": ..., "exp": ... }
// 만료 1시간. 리프레시 토큰 없음.
```
- 시크릿은 `application.yaml`의 `app.jwt.secret`, 32바이트 이상. 기본값은 로컬 전용임을 주석으로 명시.
- 알고리즘 혼동(`alg: none`) 공격 방어: 헤더의 `alg`를 신뢰하지 않고 **`HS256` 고정으로 검증**한다.

**필터 화이트리스트.**

| 경로 | 인증 |
|---|---|
| `POST /api/v1/auth/login` | 불필요 |
| `GET /api/v1/products` | 불필요 (공개 상품 목록) |
| `GET /api/v1/coupons` | **필요** (내 쿠폰) |
| `POST /api/v1/orders` | **필요** |

토큰이 없거나 깨졌으면 필터에서 `401`을 직접 쓰고 체인을 끊는다.
`ArgumentResolver`까지 내려온 시점에는 `userId`가 항상 존재한다고 가정할 수 있어야 한다.

**비밀번호는 SHA-256 + per-user salt로 저장한다.** BCrypt는 Security 스타터에 딸려오므로 쓰지 않는다.
> **README에 쓸 근거:** SHA-256은 고속 해시라 오프라인 대입 공격에 약하다. 실서비스라면 BCrypt/Argon2가 맞다.
> 인증은 과제의 평가 대상이 아니고 의존성을 늘리지 않는 쪽을 택했음을 명시한다.

**시드 데이터**는 `data.sql`. 유저 3명(`user1@imweb.test` ~ `user3@imweb.test`, 비밀번호 동일),
상품 6개(카테고리 4종에 분산, 재고 10 / 100 / 0 케이스 포함), 쿠폰 5종(정액·정률·카테고리 한정·만료·최소금액 조건).
동시성 테스트가 쓸 "재고 정확히 10개인 상품"을 반드시 하나 둔다.

---

## 7. API

```
POST /api/v1/auth/login
GET  /api/v1/products
GET  /api/v1/coupons        내 쿠폰
POST /api/v1/orders         결제 요청
```

- `/coupons`의 "사용 가능 여부"는 저장된 status만이 아니라 **유효기간까지 반영**해 내려준다. 요구사항 명시 필드.
- 결제 응답: 총 결제 금액, 쿠폰별 적용 내역, 차감 후 재고.
- 경합 실패(재고 부족, 쿠폰 중복 사용)는 `409 Conflict`.

### 7-1. 요청/응답 계약

**`POST /api/v1/auth/login`**
```jsonc
// req
{ "email": "user1@imweb.test", "password": "password" }
// res 200
{ "accessToken": "eyJ...", "expiresIn": 3600 }
```

**`GET /api/v1/products`**
```jsonc
// res 200 — 페이징 없음(§10). 전체 반환.
{ "products": [
  { "id": 1, "name": "티셔츠", "price": 20000, "stock": 10, "category": "FASHION" }
]}
```

**`GET /api/v1/coupons`** (Authorization 필요)
```jsonc
{ "coupons": [
  { "id": 11,                       // userCouponId. 주문 요청에 쓰는 ID
    "couponId": 1,
    "name": "10% 할인",
    "discountType": "PERCENTAGE",
    "discountValue": 0.10,          // FIXED면 5000 같은 원 단위
    "usable": true,                 // status + 유효기간
    "minOrderAmount": 30000,
    "maxDiscountAmount": 5000,      // 없으면 null
    "category": "FASHION",          // 전체 적용이면 null
    "validFrom": "2026-08-01T00:00:00Z",
    "validUntil": "2026-12-31T23:59:59Z" }
]}
```
> `id`가 `userCouponId`인 점을 명확히 한다. 주문 요청에서 정책 ID를 보내면 어느 발급분인지 특정할 수 없다.

**`POST /api/v1/orders`** (Authorization 필요, `Idempotency-Key` 선택)
```jsonc
// req
{ "items":   [ { "productId": 1, "quantity": 2 } ],
  "couponIds": [ 11, 12 ] }         // userCouponId 배열. 빈 배열/생략 허용

// res 200 — 승인
{ "orderId": 1001,
  "status": "PAID",
  "totalAmount": 40000,             // 원금
  "discountAmount": 9000,
  "payAmount": 31000,               // 실제 결제 금액
  "appliedCoupons": [
    { "userCouponId": 11, "discountType": "PERCENTAGE", "appliedAmount": 4000 },
    { "userCouponId": 12, "discountType": "FIXED",      "appliedAmount": 5000 }
  ],
  "items": [
    { "productId": 1, "name": "티셔츠", "quantity": 2, "unitPrice": 20000, "remainingStock": 8 }
  ],
  "pgTransactionId": "FAKE-...." }

// res 200 — PG 거절. 재고·쿠폰 복원 완료 상태
{ "orderId": 1002, "status": "FAILED", "failureReason": "DECLINED_BY_PG", ... }
```

**PG 거절을 4xx가 아니라 `200 + status:FAILED`로 내린다.**
> **README에 쓸 근거:** 요청 자체는 정상 처리됐고 주문 레코드도 남았다. 실패 원인이 클라이언트 입력이 아니라
> 외부 시스템의 판정이므로 4xx/5xx 어느 쪽도 정확하지 않다. 상태를 바디로 내려 클라이언트가 분기하게 한다.
> 반대로 **재고 부족·쿠폰 중복은 주문이 생성되지 않으므로 409**다. 이 둘의 구분이 응답 설계의 핵심이다.

### 7-2. 에러 응답

```jsonc
{ "code": "STOCK_INSUFFICIENT", "message": "재고가 부족합니다.", "detail": { "productId": 1 } }
```

| code | HTTP | 상황 |
|---|---|---|
| `INVALID_REQUEST` | 400 | 검증 실패, 쿠폰 중복 지정, 수량 범위 초과 |
| `COUPON_NOT_APPLICABLE` | 400 | 만료·최소금액 미달·카테고리 불일치 |
| `UNAUTHORIZED` | 401 | 토큰 없음/만료/서명 불일치 |
| `INVALID_CREDENTIALS` | 401 | 로그인 실패 |
| `FORBIDDEN` | 403 | 남의 쿠폰 사용 시도 |
| `PRODUCT_NOT_FOUND` / `COUPON_NOT_FOUND` | 404 | |
| `STOCK_INSUFFICIENT` | 409 | 재고 선점 실패 |
| `COUPON_ALREADY_USED` | 409 | 쿠폰 선점 실패 |
| `ORDER_IN_PROGRESS` | 409 | 같은 멱등 키의 주문이 아직 PENDING |

- **`ErrorCode` enum이 HTTP 상태와 메시지를 함께 들고 있고**, `BusinessException(ErrorCode, detail)` 하나로 끝낸다.
  예외 클래스를 코드마다 만들지 않는다(정교한 예외 계층은 §10 제외 항목).
- 로그인 실패는 "이메일 없음"과 "비밀번호 불일치"를 구분하지 않는다. 계정 존재 여부가 새어나간다.
- `@RestControllerAdvice`가 `BusinessException` / `MethodArgumentNotValidException` / `Exception` 셋만 처리한다.

---

## 8. 테스트

```kotlin
@Test
fun `재고 10개에 100명이 동시 주문하면 정확히 10건만 성공한다`() {
    val latch = CountDownLatch(1)
    val success = AtomicInteger()
    val pool = Executors.newFixedThreadPool(32)

    repeat(100) {
        pool.submit {
            latch.await()                       // 동시 출발
            runCatching { orderService.pay(cmd) }
                .onSuccess { success.incrementAndGet() }
        }
    }
    latch.countDown()
    pool.shutdown(); pool.awaitTermination(30, SECONDS)

    assertThat(success.get()).isEqualTo(10)     // 정확한 값으로 단언
    assertThat(productRepository.findById(id).stock).isZero()
}
```

- **Testcontainers 필수.** H2는 락 동작이 달라 이 테스트가 통과해도 의미가 없다. `@ServiceConnection` 사용, 이미지 태그는 `compose.yaml`과 동일하게.
- 같은 방식으로 쿠폰도: 동일 쿠폰 10개 동시 요청 → 1건만 성공.
- `PaymentGatewayMockAdaptor`에 실패를 주입해 재고·쿠폰 복원 경로도 검증.

### 8-1. 동시성 테스트가 조용히 망가지는 지점

체크하지 않으면 "통과했지만 아무것도 검증하지 않은" 테스트가 된다.

1. **테스트 메서드에 `@Transactional`을 붙이지 않는다.** 붙이면 모든 스레드가 서로의 커밋을
   못 보고 롤백으로 끝나 경합 자체가 발생하지 않는다. 정리는 `@AfterEach`에서 `TRUNCATE ... CASCADE`로 한다.
2. **HikariCP 풀 크기 ≥ 스레드 수.** 기본 10인데 32스레드를 돌리면 커넥션 대기로 사실상 직렬화된다.
   테스트 프로파일에서 `maximum-pool-size: 40`.
3. **`runCatching`으로 예외를 삼키되, 실패 원인을 수집해 단언한다.** 실패가 `OutOfStock`이 아니라
   `NullPointerException`이어도 성공 카운트는 10이 나올 수 있다.
   `failures.map { it.code }.toSet() == setOf(STOCK_INSUFFICIENT)` 까지 확인한다.
4. **`awaitTermination`이 false를 반환하면 fail 처리.** 타임아웃을 무시하고 단언하면 결과가 무의미하다.
5. 100개 스레드를 만들지 않는다. 풀 32 + 작업 100이면 충분하고, 스레드가 많을수록 컨텍스트 스위칭이
   경합을 오히려 줄인다.

### 8-2. 테스트 목록 (이것만 쓴다)

| 계층 | 테스트 |
|---|---|
| 단위 | `DiscountCalculator` — 정률→정액 순서, 최대할인 상한, 카테고리 한정, 할인>원금 clamp, 절사 |
| 단위 | `Money` — 음수 방지, 뺄셈 clamp |
| 통합 | 정상 결제 → 재고 차감·쿠폰 USED·주문 PAID |
| 통합 | PG 실패 → 재고 원복·쿠폰 AVAILABLE·주문 FAILED |
| 통합 | 재고 부족 → 409, 주문 미생성 |
| 통합 | 다건 주문 중 하나만 부족 → 전체 롤백 (다른 상품 재고도 그대로) |
| 통합 | 같은 멱등 키로 두 번 요청 → 주문 1건, 동일 응답 |
| **동시성** | 재고 10, 요청 100 → 성공 정확히 10, 재고 0 |
| **동시성** | 동일 쿠폰 10 요청 → 성공 1, 나머지 409 |

컨트롤러 슬라이스 테스트는 쓰지 않는다. 통합 테스트가 같은 경로를 지나간다.

### 8-3. 인프라

```kotlin
@SpringBootTest
@Testcontainers
abstract class IntegrationTestSupport {
    companion object {
        @Container @ServiceConnection
        @JvmStatic val postgres = PostgreSQLContainer("postgres:17-alpine")
        // static 컨테이너 1개를 전 테스트가 공유한다. 클래스마다 띄우면 시간이 배로 든다.
    }
}
```
`spring-boot-docker-compose`가 테스트에서도 컨테이너를 띄우려 하면 Testcontainers와 충돌한다.
테스트 프로파일에서 `spring.docker.compose.enabled: false`.

---

## 9. 멱등성

`Idempotency-Key` 헤더 + `Order`에 유니크 제약, 중복 요청이면 기존 결과 반환.
구현 10줄인데 결제 도메인 감각을 보여주는 지점이라 비용 대비 효과가 가장 크다.

### 9-1. 구현 상세

- 제약은 `UNIQUE (user_id, idempotency_key)`. 키만으로 유니크를 걸면 다른 유저가 같은 키를 쓸 때 충돌한다.
- 헤더는 **선택**이다. 없으면 멱등 처리 없이 그냥 새 주문. 필수로 만들면 curl 테스트가 번거로워진다.
- 처리 순서:
  ```
  T1 진입 시 select → 있으면
      status == PENDING          → 409 ORDER_IN_PROGRESS   (아직 PG 응답 대기 중)
      status == PAID | FAILED    → 저장된 주문을 그대로 응답
  없으면 insert 진행 → 유니크 위반 예외가 나면 경합이므로 다시 select 해서 위와 동일 분기
  ```
- **애플리케이션 select만으로는 부족하다.** 완전히 동시에 들어온 두 요청은 둘 다 "없음"을 보므로
  DB 유니크 제약이 실질적 방어선이고, select는 빠른 경로일 뿐이다.
- 요청 본문이 달라도 키가 같으면 기존 결과를 반환한다. 본문 해시 비교(RFC 상 422)는 구현하지 않고 한계로 적는다.

---

## 10. 하지 않을 것

**시간 쓰지 않는다 (점수 안 감)**
장바구니 · 배송/주소 · 부분 취소·환불 · 재고 예약 TTL 배치 · 페이징·검색·정렬 · 캐시 · 이벤트 발행 · Swagger · 리프레시 토큰 · 다중 통화 · 정교한 예외 계층 · 회원가입 API · 관리자 API · 재고 입고 API

**대신 넣는 것**: 멱등성(§9), CHECK 제약, 동시성 테스트.

**README에 한계로 명시할 것** — 안 만든 걸 모르고 안 만든 게 아니라는 근거:
1. T2 실패로 `PENDING`에 남는 고아 주문을 회수하는 배치가 없다.
2. PG 결과 불명(`ERROR`) 시 상태 조회·대사 절차가 없다.
3. 멱등 키 재사용 시 요청 본문 일치 검증이 없다.
4. 비밀번호 해시가 BCrypt가 아니다.
5. 포인트는 `PaymentMethod` 추상화 자리만 남겨두고 구현하지 않았다.

---

## 11. 스키마와 설정

**`ddl-auto: validate` + `schema.sql` / `data.sql`.**
Hibernate 자동 생성으로는 `CHECK (stock >= 0)`과 복합 유니크 제약을 신뢰할 수 있게 걸 수 없다.
스크립트가 먼저 돌고 `validate`가 엔티티 매핑 불일치를 잡아주는 조합이 가장 안전하다.

```sql
-- 정합성을 지탱하는 제약만 발췌. 이 네 줄이 최후 방어선이다.
ALTER TABLE product     ADD CONSTRAINT ck_product_stock       CHECK (stock >= 0);
ALTER TABLE orders      ADD CONSTRAINT uk_order_idem          UNIQUE (user_id, idempotency_key);
ALTER TABLE order_coupon ADD CONSTRAINT uk_order_coupon_uc    UNIQUE (user_coupon_id);
ALTER TABLE payment     ADD CONSTRAINT uk_payment_order       UNIQUE (order_id);
```
- 테이블명은 `orders`. `order`는 SQL 예약어라 매번 따옴표를 달아야 한다.
- 금액 칼럼은 `BIGINT NOT NULL`, 할인율은 `NUMERIC(5,4)`. `DOUBLE PRECISION` 금지.
- 조회 인덱스: `user_coupon(user_id, status)`, `order_item(order_id)`.

**`application.yaml` 핵심 항목**
```yaml
spring:
  jpa:
    open-in-view: false          # 기본값 true. 뷰 렌더까지 커넥션을 쥐고 있어 동시성 실험을 왜곡한다
    hibernate.ddl-auto: validate
    properties.hibernate.jdbc.batch_size: 30
  sql.init.mode: always
  datasource.hikari.maximum-pool-size: 20
app:
  jwt:
    secret: ${JWT_SECRET:local-dev-only-secret-must-be-32bytes+}
    expires-in-seconds: 3600
```

**트랜잭션 격리 수준은 PostgreSQL 기본값 `READ COMMITTED`를 그대로 쓴다.**
조건부 UPDATE는 문장 단위 행 락으로 정합성을 보장하므로 격리 수준을 올릴 이유가 없다.
`REPEATABLE READ`로 올리면 동시 UPDATE가 직렬화 오류로 튕겨 재시도 로직이 필요해진다.

---

## 12. 구현 순서

1. **스키마** — `schema.sql`, `data.sql`. `CHECK (stock >= 0)`, 유니크 제약 포함
2. **엔티티 + `Money`** — `data class` 금지, ID 참조, enum STRING
3. **인증** — JwtProvider / 필터 / ArgumentResolver / 로그인 API
4. **조회 API 2개** — products, coupons (사용 가능 여부 계산 포함)
5. **할인 계산기 + 단위 테스트** — DB 없이 검증 가능한 부분을 먼저 굳힌다
6. **결제 유스케이스** — T1 / PG / T2, 멱등성
7. **동시성 테스트** — 재고, 쿠폰
8. **에러 핸들러 정리**

README는 마지막에 몰아 쓰지 말고 **결정할 때마다 한 문단씩** 쌓는다.
