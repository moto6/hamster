package identity

import id.IdGenerator
import java.util.UUID

data class BookSkuId(
    val id: UUID,
) {
    fun value(): String {
        return id.toString()
    }

    companion object {
        fun create(generator: IdGenerator<UUID> = IdGenerator.default): BookSkuId {
            return BookSkuId(generator.generate())
        }

        fun of(bookSkuId: String): BookSkuId {
            return BookSkuId(UUID.fromString(bookSkuId))
        }
    }
}
