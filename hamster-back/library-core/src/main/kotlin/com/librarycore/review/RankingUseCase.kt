package com.librarycore.review

interface RankingUseCase {
    fun getHotRankings(query: RankingQuery): Any
}