package com.hamsterapi.testsupport

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.asFlow
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

/**
 * CoroutineCrudRepository 의 인메모리 테스트 대역 공통부.
 *
 * R2DBC 는 JPA 와 달리 더티체킹이 없어 save(copy(...)) 로만 상태가 바뀐다.
 * 이 대역도 같은 규칙으로 동작해야 서비스의 저장 누락 버그를 잡을 수 있으므로,
 * 반환한 엔티티를 호출부가 수정해도 스토어에 반영되지 않는다(값 복사 시맨틱).
 *
 * 테스트에서 실제로 쓰는 메서드만 구현한다. 나머지는 호출되면 즉시 실패시켜
 * "조용히 아무것도 안 하는 대역" 때문에 테스트가 거짓 통과하는 일을 막는다.
 */
abstract class InMemoryCoroutineRepository<T : Any> : CoroutineCrudRepository<T, Long> {

    private val store = LinkedHashMap<Long, T>()
    private var sequence = 0L

    /** 아직 저장 전이면 null. */
    protected abstract fun idOf(entity: T): Long?

    /** 시퀀스가 부여한 PK 를 심은 복사본. */
    protected abstract fun withId(entity: T, id: Long): T

    /** 검증용 스냅샷. 저장 순서를 유지한다. */
    fun rows(): List<T> = store.values.toList()

    override suspend fun <S : T> save(entity: S): T {
        val id = idOf(entity) ?: ++sequence
        val persisted = withId(entity, id)
        store[id] = persisted
        return persisted
    }

    override suspend fun findById(id: Long): T? = store[id]

    override suspend fun existsById(id: Long): Boolean = store.containsKey(id)

    override suspend fun count(): Long = store.size.toLong()

    override fun findAll(): Flow<T> = store.values.toList().asFlow()

    override fun findAllById(ids: Iterable<Long>): Flow<T> = ids.mapNotNull { store[it] }.asFlow()

    override suspend fun deleteById(id: Long) {
        store.remove(id)
    }

    override suspend fun deleteAllById(ids: Iterable<Long>) {
        ids.forEach { store.remove(it) }
    }

    override suspend fun delete(entity: T) {
        idOf(entity)?.let { store.remove(it) }
    }

    override suspend fun deleteAll(entities: Iterable<T>) {
        entities.forEach { delete(it) }
    }

    override suspend fun deleteAll() {
        store.clear()
    }

    override fun <S : T> saveAll(entities: Iterable<S>): Flow<S> = unsupported("saveAll(Iterable)")

    override fun <S : T> saveAll(entityStream: Flow<S>): Flow<S> = unsupported("saveAll(Flow)")

    override fun findAllById(ids: Flow<Long>): Flow<T> = unsupported("findAllById(Flow)")

    override suspend fun <S : T> deleteAll(entities: Flow<S>): Unit = unsupported("deleteAll(Flow)")

    private fun unsupported(method: String): Nothing =
        throw UnsupportedOperationException("테스트 대역이 지원하지 않는 호출: $method")
}
