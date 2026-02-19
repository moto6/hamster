package com.hasterapi.place.api.dto

data class RecentReservationResponse(
    val reservationId: String,
    val placeName: String,
    val userName: String,
    val startTime: String,
    val endTime: String,
    val status: String
)