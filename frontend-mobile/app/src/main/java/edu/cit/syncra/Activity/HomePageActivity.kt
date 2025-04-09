package edu.cit.syncra.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import edu.cit.syncra.Activity.ProfileActivity
import edu.cit.syncra.CreatePostActivity
import edu.cit.syncra.NetworkActivity
import edu.cit.syncra.R
import edu.cit.syncra.UserPostsActivity

class HomePageActivity : AppCompatActivity() {

    private lateinit var buttonGoToProfile: Button
    private lateinit var buttonGoToNetwork: Button
    private lateinit var buttonGoToPost: Button
    private lateinit var buttonGoToUserPosts: Button
    private lateinit var buttonCreatePosts: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_homepage) // Use the correct XML layout

        // Initialize the button
        buttonGoToProfile = findViewById(R.id.buttonGoToProfile)
        buttonGoToNetwork = findViewById(R.id.btnGoToNetwork)
        buttonGoToPost = findViewById(R.id.btnGoToPost)
        buttonGoToPost = findViewById(R.id.btnGoToUserPosts)
        buttonCreatePosts = findViewById(R.id.btnCreatePosts)


        // Set click listener for the button to go to ProfileActivity
        buttonGoToProfile.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }

        buttonGoToNetwork.setOnClickListener {
            val intent = Intent(this, NetworkActivity::class.java)
            startActivity(intent)
        }

        buttonGoToPost.setOnClickListener {
            val intent = Intent(this, PostActivity::class.java)
            startActivity(intent)
        }

        buttonGoToPost.setOnClickListener {
            val intent = Intent(this, UserPostsActivity::class.java)
            startActivity(intent)
        }

        buttonCreatePosts.setOnClickListener {
            val intent = Intent(this, CreatePostActivity::class.java)
            startActivity(intent)
        }





    }
}