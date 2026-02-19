package com.hasterapi.place.api.dto

data class DashboardSummaryResponse(
    val totalPlaces: Int,
    val activeReservations: Int,
    val todayBookings: Int,
    val occupancyRate: Int
)