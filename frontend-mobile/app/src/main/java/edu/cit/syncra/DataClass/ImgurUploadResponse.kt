package com.edu.cit.Syncra.network

data class ImgurUploadResponse(
    val data: ImgurData,
    val success: Boolean,
    val status: Int
)

data class ImgurData(
    val link: String
)
