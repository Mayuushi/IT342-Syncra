package edu.cit.syncra.DataClass

import com.edu.cit.Syncra.DataClass.NewsPostResponse

// NewsFeedResponse.kt
data class NewsFeedResponse(
    val message: String,
    val posts: List<NewsPostResponse>
)
