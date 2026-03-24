package com.hamsterapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(
    scanBasePackages = [
        "com.hamsterapi",
        "com.librarycore",
//        "com.iamcore",
//        "com.placecore",
    ]
)
class HamsterApiApplication

fun main(args: Array<String>) {
    runApplication<HamsterApiApplication>(*args)
}
