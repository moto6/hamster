package com.hamsterapi.book.infra.persistence.jpa

import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.domain.BookSku
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * BookOutPort 의 JPA 구현. `--spring.profiles.active=local,jpa` 로 활성화된다.
 *
 * 포트가 suspend 인 덕분에 코어(library-core)와 컨트롤러는 이 클래스의 존재를 모른다.
 * 다만 JDBC 는 블로킹이므로 이벤트 루프에서 내려보내는 경계가 반드시 필요하다 —
 * 그 경계를 감추지 않고 여기 한 줄로 드러낸다.
 */
@Component
@Profile("jpa")
class JpaBookPersistenceAdapter(
    private val writer: JpaBookWriter,
    @Qualifier("jpaBlockingDispatcher") private val dispatcher: CoroutineDispatcher,
) : BookOutPort {

    override suspend fun saveSku(bookSku: BookSku) = withContext(dispatcher) {
        writer.saveSku(bookSku)
    }
}
