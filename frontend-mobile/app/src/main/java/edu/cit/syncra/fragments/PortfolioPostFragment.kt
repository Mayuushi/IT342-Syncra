package edu.cit.syncra.fragments

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.*
import android.widget.*
import androidx.fragment.app.Fragment
import com.edu.cit.Syncra.network.RetrofitInstance
import com.github.dhaval2404.imagepicker.ImagePicker
import edu.cit.syncra.DataClass.Portfolio  // ✅ Use correct data class!
import edu.cit.syncra.R
import kotlinx.coroutines.*
import okhttp3.*
import org.json.JSONObject
import java.io.InputStream

class PortfolioPostFragment : Fragment() {

    private lateinit var inputTitle: EditText
    private lateinit var inputDescription: EditText
    private lateinit var imagePreview: ImageView
    private lateinit var btnSelectImage: Button
    private lateinit var btnSubmit: Button
    private lateinit var progressBar: ProgressBar

    private var imageUri: Uri? = null
    private val IMGUR_CLIENT_ID = "5e8602b64bcbbbb" // Replace with your real Client ID

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_portfolio_post, container, false)

        inputTitle = view.findViewById(R.id.inputProjectTitle)
        inputDescription = view.findViewById(R.id.inputProjectDescription)
        imagePreview = view.findViewById(R.id.imagePreviewPortfolio)
        btnSelectImage = view.findViewById(R.id.btnSelectPortfolioImage)
        btnSubmit = view.findViewById(R.id.btnSubmitPortfolio)
        progressBar = view.findViewById(R.id.progressLoading)

        btnSelectImage.setOnClickListener {
            ImagePicker.with(this)
                .crop()
                .galleryOnly()
                .maxResultSize(1080, 1080)
                .start()
        }

        btnSubmit.setOnClickListener {
            val title = inputTitle.text.toString().trim()
            val desc = inputDescription.text.toString().trim()
            val userId = requireContext()
                .getSharedPreferences("UserSession", 0)
                .getString("userId", null)


            if (title.isEmpty() || desc.isEmpty()) {
                Toast.makeText(requireContext(), "Fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (userId == null) {
                Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            progressBar.visibility = View.VISIBLE

            CoroutineScope(Dispatchers.IO).launch {
                val imageUrl = imageUri?.let { uploadToImgur(it) }

                if (imageUri != null && imageUrl == null) {
                    withContext(Dispatchers.Main) {
                        progressBar.visibility = View.GONE
                        Toast.makeText(requireContext(), "Image upload failed", Toast.LENGTH_SHORT).show()
                    }
                    return@launch
                }

                val portfolio = Portfolio(
                    projectTitle = title,
                    description = desc,
                    imageUrl = imageUrl
                )

                val response = RetrofitInstance.api.createPortfolio(userId, portfolio)

                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    if (response.isSuccessful) {
                        Toast.makeText(requireContext(), "Portfolio created!", Toast.LENGTH_SHORT).show()
                        inputTitle.text.clear()
                        inputDescription.text.clear()
                        imagePreview.setImageDrawable(null)
                        imagePreview.visibility = View.GONE
                        imageUri = null
                    } else {
                        Toast.makeText(requireContext(), "Failed to submit", Toast.LENGTH_SHORT).show()
                    }
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

            val requestBody = FormBody.Builder().add("image", base64Image).build()
            val request = Request.Builder()
                .url("https://api.imgur.com/3/image")
                .addHeader("Authorization", "Client-ID $IMGUR_CLIENT_ID")
                .post(requestBody)
                .build()

            val response = OkHttpClient().newCall(request).execute()
            if (response.isSuccessful) {
                val json = JSONObject(response.body?.string() ?: "")
                return@withContext json.getJSONObject("data").getString("link")
            } else null
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
