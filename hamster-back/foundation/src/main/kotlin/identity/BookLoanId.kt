package identity

import id.IdGenerator
import java.util.UUID

@JvmRecord
data class BookLoanId(
    val id: UUID,
) {
    companion object {
        fun create(idGenerator: IdGenerator<UUID> = IdGenerator.default): BookLoanId {
            return BookLoanId(idGenerator.generate())
        }
    }
}
