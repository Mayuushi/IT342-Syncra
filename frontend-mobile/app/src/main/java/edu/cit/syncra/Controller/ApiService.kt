package edu.cit.syncra.Controller

import edu.cit.syncra.DataClass.LoginRequest
import edu.cit.syncra.DataClass.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("/api/users")
    suspend fun createUser(@Body user: User): Response<Map<String, Any>>

    @POST("/api/login")  // Assuming your backend API has a login endpoint at "/api/login"
    suspend fun loginUser(@Body credentials: LoginRequest, password: String): Response<Map<String, Any>>
}
