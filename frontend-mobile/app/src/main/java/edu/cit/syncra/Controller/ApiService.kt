package edu.cit.syncra.Controller

import edu.cit.syncra.DataClass.NewsFeedResponse
import edu.cit.syncra.DataClass.NewsPost
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.DataClass.User
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {

    @POST("/api/users")
    suspend fun createUser(@Body user: User): Response<Map<String, Any>>

    @PUT("/api/users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body user: User
    ): Response<Map<String, Any>>

    @GET("/api/users")
    suspend fun getAllUsers(): Response<Map<String, Any>>

    @GET("/api/newsfeed/{userId}")
    suspend fun getPostsByUser(@Path("userId") userId: String): Response<Map<String, Any>>

    @POST("/api/newsfeed/user/{userId}")
    suspend fun createPost(
        @Path("userId") userId: String,
        @Body post: NewsPost
    ): Response<Map<String, Any>>

    @GET("/api/users/email/{email}")
    suspend fun getUserByEmail(@Path("email") email: String): Response<Map<String, Any>>

    @GET("/api/newsfeed")
    suspend fun getAllPosts(): Response<Map<String, Any>>


    @POST("/api/portfolio/user/{userId}")
    suspend fun createPortfolio(
        @Path("userId") userId: String,
        @Body portfolio: Portfolio
    ): Response<Map<String, Any>>

    @GET("/api/portfolio/user/{userId}")
    suspend fun getPortfoliosByUser(@Path("userId") userId: String): Response<List<Portfolio>>
}
