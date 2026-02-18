package collections

data class CursorPage<T>(
    val items: List<T>,
    val nextCursor: Long?,
    val hasNext: Boolean,
)