package identity

import id.IdGenerator
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotEquals

/**
 * 식별자 값객체. 외부 문자열을 식별자로 승격하는 of() 는 신뢰 경계라
 * 잘못된 입력에서 무엇이 터지는지(혹은 안 터지는지)를 고정해 둔다.
 */
class IdentityTest {

    private val fixed = UUID.fromString("00000000-0000-7000-8000-000000000000")
    private val fixedGenerator = object : IdGenerator<UUID> {
        override fun generate(): UUID = fixed
    }

    @Test
    @DisplayName("UserId.of(): 유효한 UUID 문자열을 그대로 감싼다")
    fun userId_Of_WrapsValidUuid() {
        // given
        val raw = fixed.toString()

        // when
        val userId = UserId.of(raw)

        // then
        assertEquals(fixed, userId.id)
    }

    @Test
    @DisplayName("UserId.of(): UUID 가 아닌 입력은 IllegalArgumentException 으로 거부된다")
    fun userId_Of_RejectsMalformedInput() {
        // given
        val invalid = listOf("", " ", "not-a-uuid", "123", "00000000-0000-7000-8000")

        // when & then
        invalid.forEach { raw ->
            assertFailsWith<IllegalArgumentException>("입력 [$raw] 이 통과되면 안 된다") {
                UserId.of(raw)
            }
        }
    }

    @Test
    @DisplayName("UserId.of(): 대소문자가 섞여도 같은 식별자로 취급된다")
    fun userId_Of_IsCaseInsensitive() {
        // given
        val lower = "0199a1b2-c3d4-7e5f-8a9b-0c1d2e3f4a5b"

        // when
        val fromLower = UserId.of(lower)
        val fromUpper = UserId.of(lower.uppercase())

        // then — UUID.fromString 이 정규화하므로 equals 가 성립해야 한다
        assertEquals(fromLower, fromUpper)
    }

    @Test
    @DisplayName("BookSkuId.of(): 문자열 왕복(of → value)에서 값이 보존된다")
    fun bookSkuId_RoundTrips() {
        // given
        val raw = fixed.toString()

        // when
        val restored = BookSkuId.of(raw).value()

        // then
        assertEquals(raw, restored)
    }

    @Test
    @DisplayName("BookSkuId.of(): 앞뒤 공백은 정규화되지 않고 그대로 실패한다")
    fun bookSkuId_Of_DoesNotTrim() {
        // given
        val padded = " ${fixed} "

        // when & then — 호출부가 trim 하지 않으면 500 으로 이어진다는 사실을 고정
        assertFailsWith<IllegalArgumentException> { BookSkuId.of(padded) }
    }

    @Test
    @DisplayName("create(): 주입한 생성기를 사용한다 (테스트에서 ID 고정이 가능해야 함)")
    fun create_UsesInjectedGenerator() {
        // given
        val generator = fixedGenerator

        // when
        val skuId = BookSkuId.create(generator)
        val inventoryId = BookInventoryId.create(generator)
        val loanId = BookLoanId.create(generator)
        val reservationId = BookReservationId.create(generator)

        // then
        assertEquals(fixed, skuId.id)
        assertEquals(fixed, inventoryId.id)
        assertEquals(fixed, loanId.id)
        assertEquals(fixed, reservationId.id)
    }

    @Test
    @DisplayName("create(): 기본 생성기는 호출마다 다른 값을 낸다")
    fun create_DefaultGeneratorIsUnique() {
        // given & when
        val first = BookInventoryId.create()
        val second = BookInventoryId.create()

        // then
        assertNotEquals(first, second)
    }

    @Test
    @DisplayName("식별자 타입은 서로 교환되지 않는다 (같은 UUID 라도 다른 타입)")
    fun identifiers_AreNotInterchangeable() {
        // given
        val sku = BookSkuId(fixed)
        val inventory = BookInventoryId(fixed)

        // when & then — data class equals 는 타입까지 본다. 잘못된 식별자 전달을 컴파일/런타임에서 막는 근거.
        assertNotEquals<Any>(sku, inventory)
    }
}
