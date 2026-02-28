package com.librarycore.review

import org.springframework.stereotype.Service

@Service
class RankingService : RankingUseCase {
    override fun getHotRankings(query: RankingQuery): Any {
        TODO("Not yet implemented")
    }
}