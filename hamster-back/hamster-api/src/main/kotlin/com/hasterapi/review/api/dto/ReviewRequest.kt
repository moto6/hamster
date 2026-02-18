package com.hasterapi.review.dto

data class ReviewRequest(
    val foo: String = "demo"
) {
    fun toCommand(): Any {
        TODO("Not yet implemented")
    }
}