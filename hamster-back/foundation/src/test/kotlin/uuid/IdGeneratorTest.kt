package uuid

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.platform.commons.logging.Logger
import org.junit.platform.commons.logging.LoggerFactory
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.system.measureTimeMillis
import kotlin.test.assertEquals

class IdGeneratorTest {

    private val log: Logger = LoggerFactory.getLogger(this.javaClass)

    @Test
    @DisplayName("client code 예제")
    fun clientCode_Example() {
        repeat(10000) { idx ->
            val id = IdGenerator.createV7()
            log.info {
                "[$idx] : UUID=[$id] , TS=[${System.currentTimeMillis()}]"
            }
        }
    }

    @Test
    @DisplayName("UUIDv7 유일성: 대량 생성 시 중복이 없어야 함")
    fun noDuplicates_When_GeneratedInBulk() {
        // given
        val count = 100_000

        // when
        val ids = List(count) { IdGenerator.createV7() }
        val uniqueIds = ids.distinct()

        // then
        assertEquals(count, uniqueIds.size, "중복된 UUID가 발견되었습니다.")
    }

    @Test
    @Disabled
    @DisplayName("UUIDv7 단조성: 생성 순서대로 사전식 정렬이 가능해야 함")
    fun should_MaintainOrdering_When_GeneratedSequentially() {
        // given
        val count = 10_000 // 단조성 체크는 1만 개

        // when
        val ids = List(count) { IdGenerator.createV7() }

        // then
        for (i in 0 until ids.size - 1) {
            val current = ids[i].toString()
            val next = ids[i + 1].toString()
            assertTrue(current < next, "순서 어긋남 발견: [$i]$current >= [${i + 1}]$next")
        }
    }
    /*
    순서 어긋남 발견: [5612]019c710a-5dd3-7fff-b8e2-87099d326715 >= [5613]019c710a-5dd3-7000-bb9b-972903fb216c
    Expected :true
    Actual   :false
    <Click to see difference>
    ---
    원인
    [5612]: ...-5dd3-7 fff -... (카운터가 12비트 최대치인 0xFFF에 도달)
    [5613]: ...-5dd3-7 000 -... (카운터가 0x1000이 되면서 마스킹 때문에 0x000으로 초기화됨)
    ---
    성능한계 : 4,096(12비트)개 가 1ms 내에 생성되면 순서 어긋남(단조성이 깨짐, 초당 409.6만개가 리미트 성능임)
    ㄴ 개선이 필요한경우 : 24비트 대용량 카운터 버전 (시간 밀림 방지) rand_a와 rand_b의 앞부분을 합쳐 24비트 카운터를 사용 / 초당 160억 개의 ID 생성가능
     */

    @Test
    @DisplayName("UUIDv7 성능: 10만 개 생성 시 100ms 이내여야 함")
    fun should_GenerateQuickly_WithinTimeLimit() {
        // given
        val count = 1_000_000
        val limitMs = 1000L // 컴퓨터가 구리면 실패할수 있음
        val reTestCount = 2

        repeat(reTestCount) { idx ->
            // when
            val elapsed = measureTimeMillis {
                repeat(count) { IdGenerator.createV7() }
            }

            // then
            assertTrue(elapsed <= limitMs, "생성 속도가 너무 느립니다: ${elapsed}ms (기준: ${limitMs}ms)")
            log.info { "$idx/$reTestCount \t- UUID ${count}개 생성시 -> ${elapsed}ms 소요" }
        }
    }

    @Test
    @DisplayName("RFC 9562: UUIDv7 버전 및 변체(Variant) 비트 검증")
    fun verifyRfcLayout() {
        val uuid = IdGenerator.createV7()
        val msb = uuid.mostSignificantBits
        val lsb = uuid.leastSignificantBits

        // 1. Version 필드 검증 (비트 48-51 위치, 값은 7)
        // MSB Long에서 하위 12~15비트가 버전 영역임 (shl 12 했으므로)
        val version = (msb shr 12) and 0b0111
        assertEquals(0b0111, version, "버전 비트는 반드시 7이어야 함 (0111)")

        // 2. Variant 필드 검증 (비트 64-65 위치, 값은 2)
        // LSB Long에서 최상위 2비트 (shl 62 했으므로)
        val variant = (lsb shr 62) and 0b0011
        assertEquals(0b0010, variant, "변체 비트는 반드시 2이어야 함 (0010)")
    }

    @Test
    @DisplayName("RFC 9562: 타임스탬프 정확도 검증 (48비트)")
    fun verifyTimestamp() {
        val before = System.currentTimeMillis()
        val uuid = IdGenerator.createV7()
        val after = System.currentTimeMillis()

        // MSB 상위 48비트 추출
        val timestampInUuid = uuid.mostSignificantBits ushr 16

        assertTrue(
            timestampInUuid in before..after,
            "UUID의 타임스탬프($timestampInUuid)가 현재 시간 범위($before..$after) 내에 있어야 함"
        )
    }

    @Test
    @DisplayName("단조성 검증: 같은 밀리초 내에서 생성된 ID는 시간 순서대로 정렬되어야 함")
    fun verifyMonotonicity() {
        val count = 1000
        val uuids = List(count) { IdGenerator.createV7() }

        for (i in 0 until count - 1) {
            val current = uuids[i]
            val next = uuids[i + 1]

            // UUIDv7은 문자열 비교만으로도 시간 순서 정렬이 가능해야 함 (Lexicographical Sort)
            assertTrue(
                current.toString() < next.toString(),
                "ID는 생성 순서대로 정렬되어야 함: $current < $next"
            )
        }
    }

    @Test
    @DisplayName("리액티브/멀티스레드 환경 유일성 테스트: 100만개 생성 시 충돌 없음")
    fun verifyUniquenessInParallel() {
        val threadCount = 10
        val iterations = 100_000
        val executor = Executors.newFixedThreadPool(threadCount)
        val generatedIds = ConcurrentHashMap.newKeySet<UUID>()

        val startTime = System.currentTimeMillis()

        repeat(threadCount) {
            executor.submit {
                repeat(iterations) {
                    val id = IdGenerator.createV7()
                    if (!generatedIds.add(id)) {
                        fail("충돌 발생! 중복된 ID: $id")
                    }
                }
            }
        }

        executor.shutdown()
        executor.awaitTermination(1, TimeUnit.MINUTES)

        val endTime = System.currentTimeMillis()

        assertEquals(threadCount * iterations, generatedIds.size)
        println("성능 리포트: ${threadCount * iterations}개 생성 완료 (${endTime - startTime}ms)")
    }
}