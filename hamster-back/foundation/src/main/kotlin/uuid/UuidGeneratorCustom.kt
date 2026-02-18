package uuid

import java.nio.ByteBuffer
import java.security.SecureRandom
import java.util.UUID
import java.util.concurrent.atomic.AtomicLong

object IdGenerator {
    private val random = SecureRandom()
    private val lastTimestamp = AtomicLong(-1)
    private val counter = AtomicLong(0)

    fun createV7(): UUID {
        var now = System.currentTimeMillis()
        val currentLastTs = lastTimestamp.get()
        if (now <= currentLastTs) {
            now = currentLastTs
            counter.incrementAndGet()
        } else {
            lastTimestamp.set(now)
            counter.set(0)
        }

        val randomBytes = ByteArray(10)
        random.nextBytes(randomBytes)

        var msb = 0L
        msb = msb or (now shl 16) // 48-bit timestamp
        msb = msb or (0x7L shl 12) // Version 7

        val seq = (counter.get() and 0xFFF)
        msb = msb or seq

        var lsb = 0L
        lsb = lsb or (0x2L shl 62) // Variant 2
        val randB = ByteBuffer.wrap(randomBytes, 2, 8).long and 0x3FFFFFFFFFFFFFFFL
        lsb = lsb or randB

        return UUID(msb, lsb)
    }
}