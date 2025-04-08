package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.User
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var inputName: EditText
    private lateinit var inputEmail: EditText
    private lateinit var inputPassword: EditText
    private lateinit var btnSubmitLogin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        inputName = findViewById(R.id.inputName)
        inputEmail = findViewById(R.id.inputEmail)
        inputPassword = findViewById(R.id.inputPassword)
        btnSubmitLogin = findViewById(R.id.btn_submitLogin)

        btnSubmitLogin.setOnClickListener {
            val name = inputName.text.toString().trim()
            val email = inputEmail.text.toString().trim()
            val password = inputPassword.text.toString().trim()

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
            } else {
                // Call the register function
                registerUser(name, email, password)
            }
        }
    }

    private fun registerUser(name: String, email: String, password: String) {
        val user = User(name, email, password)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.createUser(user)

                if (response.isSuccessful) {
                    val responseBody = response.body()
                    runOnUiThread {
                        // Show success message
                        Toast.makeText(this@RegisterActivity, "User registered successfully", Toast.LENGTH_SHORT).show()

                        // Redirect to login screen (LoginActivity)
                        val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                        startActivity(intent)
                        finish() // Finish RegisterActivity so the user cannot go back
                    }
                } else {
                    runOnUiThread {
                        // Handle case where user already exists
                        if (response.code() == 409) {
                            Toast.makeText(this@RegisterActivity, "User already exists with this email", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(this@RegisterActivity, "Failed to register user", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    // Handle network error
                    Toast.makeText(this@RegisterActivity, "Network error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
