package edu.cit.syncra.DataClass

data class NewsFeed(
    val id: Long,
    val userId: Long,
    val content: String,
    val timestamp: String // Or LocalDateTime, depending on your format
)
