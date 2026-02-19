package com.hasterapi.place.api.dto

data class ReservationResponse(
    val reservationId: String,
    val roomId: String,
    val roomName: String,
    val userName: String,
    val userEmail: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val purpose: String,
    val reservationStatus: String,
    val createdAt: String
)