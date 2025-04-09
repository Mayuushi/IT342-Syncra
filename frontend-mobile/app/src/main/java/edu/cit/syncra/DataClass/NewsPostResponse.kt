package edu.cit.syncra.DataClass

data class NewsPostResponse(
    val id: Long,
    val userId: Long,
    val content: String,
    val timestamp: String,
    val imageUrl: String? = null
)

