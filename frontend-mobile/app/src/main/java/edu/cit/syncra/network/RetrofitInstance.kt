package com.edu.cit.Syncra.network  // <-- Use the correct package name

import edu.cit.syncra.Controller.ApiService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {

    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl("https://it342-syncra.onrender.com")  // Replace with actual backend URL
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val api: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
