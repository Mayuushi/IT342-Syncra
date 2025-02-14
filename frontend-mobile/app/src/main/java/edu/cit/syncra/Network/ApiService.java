package edu.cit.syncra.Network;  // Inside the network package

import retrofit2.Call;
import retrofit2.http.GET;

public interface ApiService {

    // Define a GET request for your Spring Boot endpoint
    @GET("/")  // This corresponds to the root endpoint ("/") of your Spring Boot backend
    Call<String> getGreeting();  // This will call the GET request and return a String response
}
