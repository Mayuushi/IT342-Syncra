package edu.cit.syncra.Controller

import edu.cit.syncra.DataClass.Company
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
import retrofit2.http.Query

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

    @GET("/api/users/{id}")  // ✅ Add this line
    suspend fun getUserById(@Path("id") id: String): Response<Map<String, Any>>

    @GET("/api/users/email/{email}")
    suspend fun getUserByEmail(@Path("email") email: String): Response<Map<String, Any>>

    @GET("/api/newsfeed")
    suspend fun getAllPosts(): Response<Map<String, Any>>

    @GET("/api/newsfeed/{userId}")
    suspend fun getPostsByUser(@Path("userId") userId: String): Response<Map<String, Any>>

    @POST("/api/newsfeed/user/{userId}")
    suspend fun createPost(
        @Path("userId") userId: String,
        @Body post: NewsPost
    ): Response<Map<String, Any>>

    @POST("/api/portfolio/user/{userId}")
    suspend fun createPortfolio(
        @Path("userId") userId: String,
        @Body portfolio: Portfolio
    ): Response<Map<String, Any>>

    @GET("/api/portfolio/user/{userId}")
    suspend fun getPortfoliosByUser(@Path("userId") userId: String): Response<List<Portfolio>>

    // Get saved jobs
    @GET("/api/users/{userId}/saved-jobs")
    suspend fun getSavedJobs(@Path("userId") userId: String): Response<Map<String, Any>>

    // Save a job
    @POST("/api/users/{userId}/saved-jobs/{jobId}")
    suspend fun saveJob(
        @Path("userId") userId: String,
        @Path("jobId") jobId: String
    ): Response<Map<String, Any>>

    // Remove a saved job
    @retrofit2.http.DELETE("/api/users/{userId}/saved-jobs/{jobId}")
    suspend fun removeSavedJob(
        @Path("userId") userId: String,
        @Path("jobId") jobId: String
    ): Response<Map<String, Any>>

    // Get applied jobs
    @GET("/api/users/{userId}/applied-jobs")
    suspend fun getAppliedJobs(@Path("userId") userId: String): Response<Map<String, Any>>

    // Apply for a job
    @POST("/api/users/{userId}/applied-jobs/{jobId}")
    suspend fun applyForJob(
        @Path("userId") userId: String,
        @Path("jobId") jobId: String
    ): Response<Map<String, Any>>

    // Update job profile
    @PUT("/api/users/{userId}/job-profile")
    suspend fun updateJobProfile(
        @Path("userId") userId: String,
        @Body profileData: Map<String, Any>
    ): Response<Map<String, Any>>

    @POST("/api/companies")
    suspend fun createCompany(
        @Query("userId") userId: String,
        @Body company: Company
    ): Response<Company>

    @GET("/api/companies/{id}")
    suspend fun getCompanyById(@Path("id") id: String): Response<Company>

    @GET("api/companies/user/{userId}")
    suspend fun getCompaniesByUserId(@Path("userId") userId: String): Response<List<Company>>




}

