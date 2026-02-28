package id

import java.util.UUID

interface IdGenerator<T> {
    fun generate(): T

    companion object {
        val default: IdGenerator<UUID> = UuidV7()
    }
}