package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.edu.cit.Syncra.network.RetrofitInstance
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var inputEmail: EditText
    private lateinit var inputPassword: EditText
    private lateinit var btnLogin: Button

    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 1000

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize UI components
        inputEmail = findViewById(R.id.inputEmail)
        inputPassword = findViewById(R.id.inputPassword)
        btnLogin = findViewById(R.id.btn_submitLogin)

        // Initialize Google Sign-In options
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken("1007028414901-ttbv4qo04m6dq7nbcotv22ht5njhoe2c.apps.googleusercontent.com") // Replace with your actual web client ID
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)

        // Check if the user is already signed in
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null) {
            // User is signed in, navigate to HomeActivity
            goToHomePage()
        }

        // Handle login button click
        btnLogin.setOnClickListener {
            val email = inputEmail.text.toString().trim()
            val password = inputPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter both email and password", Toast.LENGTH_SHORT).show()
            } else {
                // Call login function
                loginUser(email, password)
            }
        }

        // Handle the Forgot Password TextView click
        val forgotPasswordText: TextView = findViewById(R.id.forgotPasswordText)
        forgotPasswordText.setOnClickListener {
            // Redirect to forgot password page (or your desired page)
            val intent = Intent(this, HomePageActivity::class.java)
            startActivity(intent)
            finish() // Close MainActivity if you don't want the user to return
        }

        val signUpText: TextView = findViewById(R.id.signUpText)
        signUpText.setOnClickListener {
            // Redirect to RegisterActivity (Sign up)
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun loginUser(email: String, password: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Send login request to the API
                val response = RetrofitInstance.api.loginUser(email, password)

                if (response.isSuccessful) {
                    val responseBody = response.body()
                    runOnUiThread {
                        // Show success message and navigate to HomeActivity
                        Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_SHORT).show()
                        goToHomePage()
                    }
                } else {
                    runOnUiThread {
                        // Show error message for invalid login
                        Toast.makeText(this@LoginActivity, "Invalid credentials, please try again", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    // Handle network error
                    Toast.makeText(this@LoginActivity, "Network error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account?.idToken

                Log.d("GOOGLE_SIGN_IN", "ID Token: $idToken")

                // User is signed in, navigate to HomeActivity
                goToHomePage()
            } catch (e: ApiException) {
                Log.w("GOOGLE_SIGN_IN", "Sign-in failed", e)
            }
        }
    }

    private fun goToHomePage() {
        // Start the homepage activity
        val intent = Intent(this, HomePageActivity::class.java)
        startActivity(intent)
        finish() // Close the current activity (LoginActivity)
    }
}
