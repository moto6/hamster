package com.hasterapi.place.api

import com.hasterapi.place.api.dto.BuildingResponse
import com.hasterapi.place.api.dto.DashboardSummaryResponse
import com.hasterapi.place.api.dto.PlaceDashboardResponse
import com.hasterapi.place.api.dto.RecentReservationResponse
import com.hasterapi.place.api.dto.ReservationResponse
import com.hasterapi.place.api.dto.RoomResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/* GET
/api/v0/places/dashboard
/api/v0/places/buildings
/api/v0/places (_)
/api/v0/places/{roomId}/reservations
 */
@RestController
@RequestMapping("/api/v0/places")
class PlaceController {

    @GetMapping
    suspend fun getRooms(): List<RoomResponse> {
        return MOCK_ROOMS
    }

    @GetMapping("/dashboard")
    suspend fun getDashboard(): PlaceDashboardResponse {
        return PlaceDashboardResponse(
            summary = DashboardSummaryResponse(MOCK_ROOMS.size, 32, MOCK_RESERVATIONS.size, 78),
            recentReservations = MOCK_RESERVATIONS.take(5).map {
                RecentReservationResponse(
                    it.reservationId,
                    it.roomName,
                    it.userName,
                    "${it.date}T${it.startTime}",
                    "${it.date}T${it.endTime}",
                    it.reservationStatus
                )
            }
        )
    }

    @GetMapping("/buildings")
    suspend fun getBuildings(): List<BuildingResponse> {
        return MOCK_BUILDINGS
    }


    @GetMapping("/places/{roomId}/reservations")
    suspend fun getRoomReservations(@PathVariable roomId: String): List<ReservationResponse> {
        return MOCK_RESERVATIONS.filter { it.roomId == roomId }
    }

    companion object {
        private val MOCK_BUILDINGS = listOf(
            BuildingResponse("bld-9f2d1a3c", "태평로 A-Space", "서울시 중구 태평로 123", 20, 10, true),
            BuildingResponse("bld-4e7b8c2d", "서초 R&D 센터", "서울시 서초구 R&D로 456", 5, 6, true)
        )

        private val MOCK_ROOMS = listOf(
            RoomResponse(
                "room-v1",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "타운홀",
                "20층",
                50,
                listOf("res-a1b2c3d4", "res-q7r8s9t0"),
                true
            ),
            RoomResponse("room-r1", "bld-4e7b8c2d", "서초 R&D 센터", "집중 연구실 1", "5층", 10, listOf("res-m3n4o5p6"), true)
        )

        private val MOCK_RESERVATIONS = listOf(
            ReservationResponse(
                "rev-v1-01",
                "room-v1",
                "타운홀",
                "경영지원팀",
                "admin@company.com",
                "2026-02-11",
                "09:00",
                "11:00",
                "전사 타운홀 준비",
                "CHECKED_OUT",
                "2026-02-10 14:00"
            )
        )
    }
}