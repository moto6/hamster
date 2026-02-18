package com.hasterapi.review

import com.librarycore.review.RankingQuery
import com.librarycore.review.RankingUseCase
import com.librarycore.review.ReviewUseCase
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/library/v0/review")
class ReviewController(
    private val reviewUseCase: ReviewUseCase,
    private val rankingUseCase: RankingUseCase,
) {
    @GetMapping("/view")
    suspend fun getBookRatings(@RequestParam isbn: String) = reviewUseCase.getRatingStats(isbn)

    @PostMapping("/register")
    suspend fun writeReview(@RequestBody req: ReviewRequest) = reviewUseCase.write(req.toCommand())

    @PutMapping("/{id}")
    suspend fun editReview(@PathVariable id: Long, @RequestBody req: ReviewRequest) =
        reviewUseCase.update(id, req.toCommand())

    @DeleteMapping("/{id}")
    suspend fun removeReview(@PathVariable id: Long) = reviewUseCase.delete(id)

    @GetMapping
    suspend fun getHotBooks(query: RankingQuery) = rankingUseCase.getHotRankings(query)
}