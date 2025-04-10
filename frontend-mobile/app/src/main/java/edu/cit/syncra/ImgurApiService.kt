package com.edu.cit.Syncra.network

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.*

interface ImgurApiService {

    @Multipart
    @POST("image")
    fun uploadImage(
        @Header("Authorization") authHeader: String,
        @Part image: MultipartBody.Part
    ): Call<ImgurUploadResponse>
}
