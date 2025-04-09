package edu.cit.syncra.DataClass

data class User(
    val id: Long? = null,
    val name: String,
    val email: String,
    val password: String,
    val post: String? = null
)
