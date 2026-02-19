package com.hasterapi.place.api.dto

data class BuildingResponse(
    val id: String,
    val name: String,
    val address: String,
    val floors: Int,
    val roomCount: Int,
    val buildingAvailable: Boolean
)