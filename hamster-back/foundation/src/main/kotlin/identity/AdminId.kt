package identity

import id.IdGenerator
import java.util.UUID

class AdminId(
    val id: UUID,
) {
    companion object {
        fun create(idGenerator: IdGenerator<UUID> = IdGenerator.default): BookInventoryId {
            return BookInventoryId(idGenerator.generate())
        }
    }
}