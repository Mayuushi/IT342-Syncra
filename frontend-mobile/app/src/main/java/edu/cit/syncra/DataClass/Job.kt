package edu.cit.syncra.DataClass

data class Job(
    val id: String,
    val title: String,
    val description: String,
    val company: String,
    val location: String,
    val type: String,
    val postedDate: String,
    val isApplied: Boolean = false // ← Add this line with a default value
)

