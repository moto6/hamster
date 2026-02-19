package com.hasterapi.place.api

import com.hasterapi.place.api.dto.ReservationResponse
import com.hasterapi.place.api.dto.ResourceResponse
import com.hasterapi.place.api.dto.RoomResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/*
/api/v0/admin/places/room-resource
/api/v0/admin/places/rooms
/api/v0/admin/places/reservations
 */
@RestController
@RequestMapping("/api/v0/admin/places")
class PlaceAdminController {

    @GetMapping("/room-resource")
    fun fetchRoomResources(): List<ResourceResponse> {
        return MOCK_ROOM_RESOURCES
    }

    @GetMapping("/rooms")
    fun fetchRooms(): List<RoomResponse> {
        return MOCK_ROOMS
    }


    @GetMapping("/reservations")
    fun fetchReservations(): List<ReservationResponse> {
        return MOCK_RESERVATIONS
    }

    companion object {
        private val MOCK_ROOM_RESOURCES = listOf(
            ResourceResponse("res-a1b2c3d4", "4K 프로젝터", "디스플레이", "4K 고해상도 빔 프로젝터"),
            ResourceResponse("res-e5f6g7h8", "화이트보드", "필기도구", "대형 이동식 화이트보드"),
            ResourceResponse("res-i9j0k1l2", "화상회의 시스템", "전자기기", "Logitech Rally Bar"),
            ResourceResponse("res-m3n4o5p6", "65인치 모니터", "디스플레이", "삼성 스마트 사이니지"),
            ResourceResponse("res-q7r8s9t0", "무선 마이크", "음향장비", "Shure 무선 마이크 세트"),
            ResourceResponse("res-app-4k", "AppleTV 4K", "전자기기", "최신형 Apple TV")
        )

        private val MOCK_ROOMS = listOf(
            RoomResponse(
                "room-v1",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "타운홀",
                "20층",
                50,
                listOf("res-a1b2c3d4", "res-q7r8s9t0", "res-i9j0k1l2"),
                true
            ),
            RoomResponse(
                "room-v2",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "Summit Room #1",
                "20층",
                12,
                listOf("res-m3n4o5p6", "res-i9j0k1l2", "res-app-4k"),
                true
            ),
            RoomResponse(
                "room-v203",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "Summit Room #2",
                "20층",
                12,
                listOf("res-m3n4o5p6", "res-i9j0k1l2", "res-app-4k"),
                true
            ),
            RoomResponse(
                "room-v3",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "Terceira",
                "10층",
                15,
                listOf("res-a1b2c3d4", "res-e5f6g7h8"),
                true
            ),
            RoomResponse(
                "room-v401",
                "bld-9f2d1a3c",
                "태평로 A-Space",
                "Las Palmas",
                "10층",
                15,
                listOf("res-a1b2c3d4"),
                false
            ),
            RoomResponse("room-v402", "bld-9f2d1a3c", "태평로 A-Space", "Cuba", "10층", 15, listOf("res-a1b2c3d4"), false),
            RoomResponse("room-v5", "bld-9f2d1a3c", "태평로 A-Space", "Point NEMO", "3층", 8, listOf("res-m3n4o5p6"), true),
            RoomResponse("room-v6", "bld-9f2d1a3c", "태평로 A-Space", "Parabellum", "3층", 8, listOf("res-e5f6g7h8"), true)
        )

        private val MOCK_RESERVATIONS = listOf(
            ReservationResponse(
                "rev-a7-01",
                "room-a7",
                "사일로 7",
                "TF팀 A",
                "tf_a@next.com",
                "2026-02-11",
                "09:00",
                "11:00",
                "집중 코딩 세션",
                "CHECKED_OUT",
                "2026-02-11 07:00"
            ),
            ReservationResponse(
                "rev-a7-02",
                "room-a7",
                "사일로 7",
                "TF팀 A",
                "tf_a@next.com",
                "2026-02-11",
                "11:00",
                "13:00",
                "모듈 통합 테스트",
                "NO_SHOW",
                "2026-02-11 07:00"
            ),
            ReservationResponse(
                "rev-a7-03",
                "room-a7",
                "사일로 7",
                "TF팀 A",
                "tf_a@next.com",
                "2026-02-11",
                "14:00",
                "16:00",
                "중간 보고서 작성",
                "CHECKED_IN",
                "2026-02-11 07:00"
            ),
            ReservationResponse(
                "rev-a10-01",
                "room-a10",
                "사일로 10",
                "외부컨설팅",
                "consult@partner.com",
                "2026-02-11",
                "10:00",
                "11:30",
                "시스템 진단 미팅",
                "CHECKED_OUT",
                "2026-02-08 11:00"
            ),
            ReservationResponse(
                "rev-v1-1",
                "room-v1",
                "Sevastopol",
                "경영전략본부",
                "strategy@co.com",
                "2026-02-11",
                "09:00",
                "11:00",
                "2026 상반기 타운홀",
                "CHECKED_OUT",
                "2026-02-01 09:00"
            ),
            ReservationResponse(
                "rev-v1-2",
                "room-v1",
                "Sevastopol",
                "HR팀",
                "hr@co.com",
                "2026-02-11",
                "13:00",
                "15:00",
                "전사 필수 성희롱 예방교육",
                "CHECKED_OUT",
                "2026-02-05 14:00"
            )
        )
    }
}