package com.hasterapi.place.api.dto

data class PlaceDashboardResponse(
    val summary: DashboardSummaryResponse,
    val recentReservations: List<RecentReservationResponse>
)