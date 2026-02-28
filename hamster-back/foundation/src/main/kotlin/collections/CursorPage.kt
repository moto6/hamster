package collections

data class CursorPage<T>(
    val content: List<T>,
    val currentCursor: Long,
    val resultsCount: Int,
    val hasNext: Boolean,
) {
    companion object {
        fun <T> of(items: List<T>): CursorPage<T> {
            return CursorPage(
                content = items,
                currentCursor = 0L,
                resultsCount = items.size,
                hasNext = false,
            )
        }
    }
}