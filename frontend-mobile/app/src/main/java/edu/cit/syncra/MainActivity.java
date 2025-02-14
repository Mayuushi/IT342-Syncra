package edu.cit.syncra;  // Your main package

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import edu.cit.syncra.Network.ApiService;  // Import the Retrofit interface
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private static final String BASE_URL = "http://10.0.2.2:8080/";  // Use this if testing on an emulator (replace localhost)
    private TextView textView;  // Reference to your TextView to display the response

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.main);  // Reference your TextView

        // Initialize Retrofit instance
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)  // Set the backend URL of your Spring Boot API
                .addConverterFactory(GsonConverterFactory.create())  // For converting JSON responses
                .build();

        // Create an instance of ApiService to call methods on your API
        ApiService apiService = retrofit.create(ApiService.class);

        // Make a GET request to your Spring Boot backend
        Call<String> call = apiService.getGreeting();

        // Asynchronous request
        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                if (response.isSuccessful()) {
                    textView.setText(response.body());  // Display the response in the TextView
                } else {
                    textView.setText("Request failed: " + response.code());  // Handle errors
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                textView.setText("Error: " + t.getMessage());  // Display errors in case of failure
            }
        });
    }
}
