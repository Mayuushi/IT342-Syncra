package edu.cit.syncra

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.syncra.DataClass.NewsPost
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.edu.cit.Syncra.network.RetrofitInstance

class CreatePostActivity : AppCompatActivity() {

    private lateinit var contentEditText: EditText
    private lateinit var imageButton: Button
    private lateinit var postButton: Button

    private var uploadedImageUrl: String? = null

    private val IMAGE_PICK_REQUEST_CODE = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_post)

        contentEditText = findViewById(R.id.editTextContent)
        imageButton = findViewById(R.id.buttonSelectImage)
        postButton = findViewById(R.id.buttonPost)

        // Image selection
        imageButton.setOnClickListener {
            val selectImageIntent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(selectImageIntent, IMAGE_PICK_REQUEST_CODE)
        }

        // Post creation
        postButton.setOnClickListener {
            val content = contentEditText.text.toString().trim()
            val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
            val userId = sharedPref.getLong("userId", -1L)

            if (userId != -1L && content.isNotEmpty()) {
                createPost(userId, content)
            } else {
                Toast.makeText(this, "Content cannot be empty or User not found.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    // Handle the image selection
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == IMAGE_PICK_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            val selectedImageUri: Uri? = data?.data
            // Save the image URL or path, you can upload it to the server if necessary
            uploadedImageUrl = selectedImageUri?.toString() // Here, we are just using the URI as a placeholder
        }
    }

    // Create post with the content and optional image URL
    private fun createPost(userId: Long, content: String) {
        val postBody = NewsPost(content = content, imageUrl = uploadedImageUrl)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitInstance.api.createPost(userId, postBody)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@CreatePostActivity, "Post created", Toast.LENGTH_SHORT).show()
                        finish() // Close the activity after posting
                    } else {
                        Toast.makeText(this@CreatePostActivity, "Failed to create post", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CreatePostActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
