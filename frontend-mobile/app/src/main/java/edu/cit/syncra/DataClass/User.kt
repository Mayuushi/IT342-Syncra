package edu.cit.syncra.DataClass

data class User(
    val id: String?,
    val name: String,
    val email: String,
    val password: String? = null,
    val post: String? = null
)
