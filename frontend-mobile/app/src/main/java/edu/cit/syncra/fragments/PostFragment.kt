package edu.cit.syncra.fragments

import android.app.Activity
import android.content.Context.MODE_PRIVATE
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import com.edu.cit.Syncra.network.RetrofitInstance
import com.github.dhaval2404.imagepicker.ImagePicker
import edu.cit.syncra.DataClass.NewsPost
import edu.cit.syncra.R
import kotlinx.coroutines.*
import okhttp3.*
import org.json.JSONObject
import java.io.InputStream

class PostFragment : Fragment() {

    private lateinit var inputPost: EditText
    private lateinit var btnSubmitPost: Button
    private lateinit var btnSelectImage: Button
    private lateinit var imagePreview: ImageView
    private lateinit var progressBar: ProgressBar
    private var imageUri: Uri? = null

    private val IMGUR_CLIENT_ID = "5e8602b64bcbbbb" // Replace with your Imgur client ID

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_post, container, false)

        inputPost = view.findViewById(R.id.inputPost)
        btnSubmitPost = view.findViewById(R.id.btnSubmitPost)
        btnSelectImage = view.findViewById(R.id.btnSelectImage)
        imagePreview = view.findViewById(R.id.imagePreview)
        progressBar = view.findViewById(R.id.progressBar)

        btnSelectImage.setOnClickListener {
            ImagePicker.with(this)
                .crop()
                .galleryOnly()
                .maxResultSize(1080, 1080)
                .start()
        }

        btnSubmitPost.setOnClickListener {
            val content = inputPost.text.toString().trim()
            val sharedPref = requireContext().getSharedPreferences("UserSession", MODE_PRIVATE)
            val userId = sharedPref.getLong("userId", -1L)

            if (content.isEmpty() && imageUri == null) {
                Toast.makeText(requireContext(), "Post cannot be empty", Toast.LENGTH_SHORT).show()
            } else if (userId == -1L) {
                Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
            } else {
                showLoading(true)
                CoroutineScope(Dispatchers.IO).launch {
                    val imageUrl = imageUri?.let { uploadToImgur(it) }

                    withContext(Dispatchers.Main) {
                        if (imageUri != null && imageUrl == null) {
                            showLoading(false)
                            Toast.makeText(requireContext(), "Image upload failed", Toast.LENGTH_SHORT).show()
                            return@withContext
                        }
                    }

                    submitPost(userId, content, imageUrl)
                }
            }
        }

        return view
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK && data != null) {
            imageUri = data.data
            imagePreview.setImageURI(imageUri)
            imagePreview.visibility = View.VISIBLE
        }
    }

    private suspend fun uploadToImgur(uri: Uri): String? = withContext(Dispatchers.IO) {
        try {
            val inputStream: InputStream? = requireContext().contentResolver.openInputStream(uri)
            val imageBytes = inputStream?.readBytes()
            val base64Image = Base64.encodeToString(imageBytes, Base64.DEFAULT)

            val requestBody = FormBody.Builder()
                .add("image", base64Image)
                .build()

            val request = Request.Builder()
                .url("https://api.imgur.com/3/image")
                .addHeader("Authorization", "Client-ID $IMGUR_CLIENT_ID")
                .post(requestBody)
                .build()

            val client = OkHttpClient()
            val response = client.newCall(request).execute()

            if (response.isSuccessful) {
                val json = JSONObject(response.body?.string() ?: "")
                return@withContext json.getJSONObject("data").getString("link")
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    private suspend fun submitPost(userId: Long, content: String, imageUrl: String?) {
        try {
            val response = RetrofitInstance.api.createPost(userId, NewsPost(content, imageUrl))
            withContext(Dispatchers.Main) {
                showLoading(false)
                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Post created!", Toast.LENGTH_SHORT).show()
                    inputPost.text.clear()
                    imagePreview.visibility = View.GONE
                    imagePreview.setImageDrawable(null)
                    imageUri = null
                } else {
                    Toast.makeText(requireContext(), "Failed to create post", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: Exception) {
            withContext(Dispatchers.Main) {
                showLoading(false)
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        btnSubmitPost.isEnabled = !isLoading
        btnSelectImage.isEnabled = !isLoading
    }
}
