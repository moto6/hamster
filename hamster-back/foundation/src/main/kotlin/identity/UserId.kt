package identity

import id.IdGenerator
import java.util.UUID

@JvmRecord
data class UserId(
    val id: UUID,
) {
    companion object {
        fun generate(idGenerator: IdGenerator<UUID> = IdGenerator.default): UserId {
            return UserId(idGenerator.generate())
        }

        fun of(userId: String): UserId {
            return UserId(UUID.fromString(userId))
        }
    }
}
