package edu.cit.syncra.DataClass

data class UserPost(
    val id: Long,
    val content: String,
    val createdAt: String?,
    val userName: String?
)
