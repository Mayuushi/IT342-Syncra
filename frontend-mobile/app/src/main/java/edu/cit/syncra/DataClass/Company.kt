package edu.cit.syncra.DataClass

import java.util.Date

data class Company(
    val id: String? = null,
    val name: String,
    val description: String,
    val websiteUrl: String,
    val logoUrl: String,
    val industry: String,
    val location: String,
    val size: String,
    val foundedDate: String?,
    val email: String,
    val phone: String
)
