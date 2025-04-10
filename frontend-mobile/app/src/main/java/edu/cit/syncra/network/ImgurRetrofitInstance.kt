package com.edu.cit.Syncra.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ImgurRetrofitInstance {
    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl("https://api.imgur.com/3/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val api: ImgurApiService by lazy {
        retrofit.create(ImgurApiService::class.java)
    }
}
