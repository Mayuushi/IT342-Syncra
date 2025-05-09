package edu.cit.syncra.DataClass

data class Job(
    val id: String,
    val title: String,
    val description: String,
    val company: String,
    val location: String,
    val type: String,           // e.g., "Full-time", "Internship"
    val postedDate: String      // ISO date format or timestamp
)
