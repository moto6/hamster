package com.hasterapi.place.api.dto

data class RoomResponse(
    val roomId: String,
    val buildingId: String,
    val buildingName: String,
    val roomName: String,
    val roomFloor: String,
    val capacity: Int,
    val resourceIds: List<String>,
    val roomAvailable: Boolean,
    val roomFloorMap: String = "",
    val roomLocationNote: String = ""
)