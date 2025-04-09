package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class LandingPageActivity : AppCompatActivity() {

    private lateinit var buttonGoToProfile: Button
    private lateinit var buttonGoToNetwork: Button
    private lateinit var buttonGoToPost: Button
    private lateinit var buttonGoToUserPosts: Button
    private lateinit var buttonGoToCreatePost: Button



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_homepage) // Use the correct XML layout

        // Initialize the button
        buttonGoToProfile = findViewById(R.id.btnGoToProfile)
        buttonGoToNetwork = findViewById(R.id.btnGoToNetwork)
        buttonGoToPost = findViewById(R.id.btnViewPost)
        buttonGoToCreatePost = findViewById(R.id.btnCreatePost)


        buttonGoToProfile.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }

        buttonGoToNetwork.setOnClickListener {
            val intent = Intent(this, NetworkActivity::class.java)
            startActivity(intent)
        }

        buttonGoToPost.setOnClickListener {
            val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
            val userId = sharedPref.getLong("userId", -1L)
            val userName = sharedPref.getString("userName", "Unknown")

            val intent = Intent(this, UserPostsActivity::class.java)
            intent.putExtra("USER_ID", userId)
            intent.putExtra("USER_NAME", userName)
            startActivity(intent)
        }


        buttonGoToCreatePost.setOnClickListener {
            val intent = Intent(this, PostActivity::class.java)
            startActivity(intent)
        }







    }
}