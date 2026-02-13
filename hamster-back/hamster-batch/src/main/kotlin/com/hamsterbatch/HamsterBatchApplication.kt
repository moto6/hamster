package com.hamsterbatch

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HamsterBatchApplication

fun main(args: Array<String>) {
	runApplication<HamsterBatchApplication>(*args)
}
