package identity

import java.util.UUID

@JvmRecord
data class BookInventoryId(
    val id: String
) {
    companion object {
        fun create(): BookInventoryId {
            return BookInventoryId(UUID.randomUUID().toString())
        }
    }
}