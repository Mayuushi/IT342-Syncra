package edu.cit.syncra.DataClass

data class NewsPost(
    val content: String,
    val imageUrl: String? = null  // Make imageUrl optional
)
