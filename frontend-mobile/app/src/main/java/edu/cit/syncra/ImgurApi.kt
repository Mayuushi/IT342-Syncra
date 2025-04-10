package edu.cit.syncra

import com.edu.cit.Syncra.network.ImgurUploadResponse
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.*

interface ImgurApi {
    @Multipart
    @POST("3/image")
    fun uploadImage(
        @Header("Authorization") auth: String,
        @Part image: MultipartBody.Part
    ): Call<ImgurUploadResponse>
}
