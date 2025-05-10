package edu.cit.syncra.DataClass

data class User(
    val id: String?,
    val name: String,
    val email: String,
    val password: String? = null,
    val post: String? = null,

    // Job-related fields
    val savedJobs: List<Job> = emptyList(),
    val appliedJobs: List<Job> = emptyList(),

    val resumeUrl: String? = null,
    val jobTitle: String? = null,
    val skills: List<String> = emptyList(),
    val experience: String? = null,
    val education: String? = null
)
