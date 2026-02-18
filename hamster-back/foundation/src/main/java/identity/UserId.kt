package identity

import java.util.UUID

@JvmRecord
data class UserId(
    val id: String,
) {
    init {
        require(id.isBlank()) { "UserId must not be null or blank" }
    }

    companion object {
        fun generate(): UserId {
            return UserId(UUID.randomUUID().toString())
        }
    }
}
