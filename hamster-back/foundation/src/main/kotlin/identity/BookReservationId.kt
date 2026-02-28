package identity

import id.IdGenerator
import java.util.UUID


@JvmRecord
data class BookReservationId(
    val id: UUID,
) {
    companion object {
        fun create(idGenerator: IdGenerator<UUID> = IdGenerator.default): BookReservationId {
            return BookReservationId(idGenerator.generate())
        }
    }
}

