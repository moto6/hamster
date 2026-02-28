package com.hasterapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(
    scanBasePackages = [
        "com.hasterapi",   // API 모듈 스캔
        "com.librarycore",  // 라이브러리 모듈 스캔
//        "com.iamcore",      // IAM 모듈 스캔 (예상)
//        "com.placecore"     // Place 모듈 스캔 (예상)
    ]
)
class HamsterApiApplication

fun main(args: Array<String>) {
    runApplication<HamsterApiApplication>(*args)
}
