package edu.cit.syncra.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.R
import edu.cit.syncra.Activity.RegisterActivity
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
            val intent = Intent(this, HomePageActivity::class.java)
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
                val response = RetrofitInstance.api.getAllUsers()

                if (response.isSuccessful) {
                    val body = response.body()
                    val users = (body?.get("users") as? List<Map<String, Any>>)?.mapNotNull {
                        val userEmail = it["email"] as? String
                        val userPassword = it["password"] as? String
                        val userName = it["name"] as? String
                        val userId = (it["id"] as? Number)?.toLong()

                        if (userEmail != null && userPassword != null && userName != null && userId != null) {
                            User(
                                id = userId,
                                name = userName,
                                email = userEmail,
                                password = userPassword
                            )
                        } else null
                    }

                    val matchedUser = users?.find { it.email == email && it.password == password }

                    // After login success
                    withContext(Dispatchers.Main) {
                        if (matchedUser != null) {
                            // Save user data to SharedPreferences
                            val user = matchedUser
                            val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
                            with(sharedPref.edit()) {
                                putLong("userId", user.id ?: -1) // Default to -1 if user.id is null
                                putString("name", user.name)
                                putString("email", user.email)
                                apply()
                            }

                            Toast.makeText(
                                this@LoginActivity,
                                "Login successful",
                                Toast.LENGTH_SHORT
                            ).show()
                            goToHomePage()
                        } else {
                            Toast.makeText(
                                this@LoginActivity,
                                "Invalid credentials",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(
                            this@LoginActivity,
                            "Failed to retrieve users",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@LoginActivity, "Network error occurred", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        }
    }

    private fun goToHomePage() {
        val intent = Intent(this, HomePageActivity::class.java)
        startActivity(intent)
        finish()
    }
}