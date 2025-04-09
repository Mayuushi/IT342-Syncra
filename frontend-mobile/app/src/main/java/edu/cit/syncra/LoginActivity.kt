package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.edu.cit.Syncra.network.RetrofitInstance
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    private lateinit var inputEmail: EditText
    private lateinit var inputPassword: EditText
    private lateinit var btnLogin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        inputEmail = findViewById(R.id.inputEmail)
        inputPassword = findViewById(R.id.inputPassword)
        btnLogin = findViewById(R.id.btn_submitLogin)

        btnLogin.setOnClickListener {
            val email = inputEmail.text.toString().trim()
            val password = inputPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter both email and password", Toast.LENGTH_SHORT).show()
            } else {
                loginUser(email, password)
            }
        }

        val forgotPasswordText: TextView = findViewById(R.id.forgotPasswordText)
        forgotPasswordText.setOnClickListener {
            val intent = Intent(this, LandingPageActivity::class.java)
            startActivity(intent)
            finish()
        }

        val signUpText: TextView = findViewById(R.id.signUpText)
        signUpText.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun loginUser(email: String, password: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Make the request to get the user by email
                val response = RetrofitInstance.api.getUserByEmail(email)

                if (response.isSuccessful) {
                    val body = response.body()
                    val user = body?.get("user") as? Map<String, Any>

                    if (user != null) {
                        val userEmail = user["email"] as? String
                        val userPassword = user["password"] as? String
                        val userName = user["name"] as? String
                        val userId = (user["id"] as? Number)?.toLong()

                        // Check if the retrieved user matches the input password
                        if (userEmail == email && userPassword == password) {
                            // Save the user data to SharedPreferences
                            withContext(Dispatchers.Main) {
                                val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
                                with(sharedPref.edit()) {
                                    putLong("userId", userId ?: -1)
                                    putString("name", userName)
                                    putString("email", userEmail)
                                    apply()
                                }

                                Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_SHORT).show()
                                goToHomePage()
                            }
                        } else {
                            withContext(Dispatchers.Main) {
                                Toast.makeText(this@LoginActivity, "Invalid credentials", Toast.LENGTH_SHORT).show()
                            }
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@LoginActivity, "User not found", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@LoginActivity, "Failed to retrieve user", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@LoginActivity, "Network error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }



    private fun goToHomePage() {
        val intent = Intent(this, LandingPageActivity::class.java)
        startActivity(intent)
        finish()
    }
}
