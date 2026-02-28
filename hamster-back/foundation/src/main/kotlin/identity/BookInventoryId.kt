package identity

import id.IdGenerator
import java.util.UUID

@JvmRecord
data class BookInventoryId(
    val id: UUID,
) {
    companion object {
        fun create(idGenerator: IdGenerator<UUID> = IdGenerator.default): BookInventoryId {
            return BookInventoryId(idGenerator.generate())
        }
    }
}