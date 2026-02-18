package identity

import java.util.UUID

class AdminId(
    val id: String
) {
    companion object {
        fun create(): BookInventoryId {
            return BookInventoryId(UUID.randomUUID().toString())
        }
    }
}