package com.edu.cit.Syncra.DataClass

import edu.cit.syncra.DataClass.User

data class NewsPostResponse(
    val id: String,
    val content: String,
    val imageUrl: String?,
    val createdAt: String?,
    val user: User
)

