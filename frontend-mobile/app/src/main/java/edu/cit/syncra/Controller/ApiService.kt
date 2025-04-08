package edu.cit.syncra.Controller

import edu.cit.syncra.DataClass.User
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("/api/users")
    suspend fun createUser(@Body user: User): Response<Map<String, Any>>

    @GET("/api/users")
    suspend fun getAllUsers(): Response<Map<String, Any>>
}
