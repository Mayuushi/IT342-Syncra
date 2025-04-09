package edu.cit.syncra.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import edu.cit.syncra.R

class ProfileActivity : AppCompatActivity() {

    private lateinit var nameTextView: TextView
    private lateinit var emailTextView: TextView
    private lateinit var logoutButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        nameTextView = findViewById(R.id.textViewName)
        emailTextView = findViewById(R.id.textViewEmail)
        logoutButton = findViewById(R.id.btnLogout)

        val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
        val name = sharedPref.getString("name", "N/A")
        val email = sharedPref.getString("email", "N/A")

        nameTextView.text = "Name: $name"
        emailTextView.text = "Email: $email"

        logoutButton.setOnClickListener {
            // Clear session
            sharedPref.edit().clear().apply()

            // Go back to login screen
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}