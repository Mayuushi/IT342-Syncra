package edu.cit.syncra.fragments

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.edu.cit.Syncra.network.RetrofitInstance
import com.google.android.material.bottomnavigation.BottomNavigationView
import edu.cit.syncra.DataClass.NewsPost
import edu.cit.syncra.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PostFragment : Fragment() {

    private lateinit var inputPost: EditText
    private lateinit var btnSubmitPost: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_post, container, false)

        inputPost = view.findViewById(R.id.inputPost)
        btnSubmitPost = view.findViewById(R.id.btnSubmitPost)

        btnSubmitPost.setOnClickListener {
            val content = inputPost.text.toString().trim()
            if (content.isEmpty()) {
                Toast.makeText(requireContext(), "Post cannot be empty", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val sharedPref = requireContext().getSharedPreferences("UserSession", MODE_PRIVATE)
            val userId = sharedPref.getLong("userId", -1L)

            if (userId != -1L) {
                submitPost(userId, content)
            } else {
                Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
            }
        }

        return view
    }

    private fun submitPost(userId: Long, content: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.createPost(userId, NewsPost(content))
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(requireContext(), "Post created!", Toast.LENGTH_SHORT).show()
                        inputPost.text.clear()
                    } else {
                        Toast.makeText(requireContext(), "Failed to create post", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
