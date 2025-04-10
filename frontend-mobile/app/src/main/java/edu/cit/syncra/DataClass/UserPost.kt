package edu.cit.syncra.DataClass

data class UserPost(
    val id: Long,
    val content: String,
    val createdAt: String?,
    val authorName: String? = null,
    val imageUrl: String? = null

)

