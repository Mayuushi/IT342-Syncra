package edu.cit.syncra.Activity

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.NewsPost
import edu.cit.syncra.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PostActivity : AppCompatActivity() {

    private lateinit var inputPost: EditText
    private lateinit var btnSubmitPost: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_post)

        inputPost = findViewById(R.id.inputPost)
        btnSubmitPost = findViewById(R.id.btnSubmitPost)

        btnSubmitPost.setOnClickListener {
            val content = inputPost.text.toString().trim()
            if (content.isEmpty()) {
                Toast.makeText(this, "Post cannot be empty", Toast.LENGTH_SHORT).show()
            } else {
                val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
                val userId = sharedPref.getLong("userId", -1)
                if (userId != -1L) {
                    submitPost(userId, content)
                } else {
                    Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun submitPost(userId: Long, content: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.createPost(userId, NewsPost(content))
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@PostActivity, "Post created!", Toast.LENGTH_SHORT)
                            .show()
                        finish() // Close the activity after posting
                    } else {
                        Toast.makeText(
                            this@PostActivity,
                            "Failed to create post",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@PostActivity, "Error: ${e.message}", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        }
    }
}