package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class HomePageActivity : AppCompatActivity() {

    private lateinit var buttonGoToProfile: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_homepage) // Use the correct XML layout

        // Initialize the button
        buttonGoToProfile = findViewById(R.id.buttonGoToProfile)

        // Set click listener for the button to go to ProfileActivity
        buttonGoToProfile.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }
    }
}
