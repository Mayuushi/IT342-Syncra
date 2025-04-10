package edu.cit.syncra.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.Adapter.UserPostAdapter
import edu.cit.syncra.DataClass.UserPost
import edu.cit.syncra.LoginActivity
import edu.cit.syncra.R
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ProfileAndPostsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: UserPostAdapter
    private lateinit var nameTextView: TextView
    private lateinit var emailTextView: TextView
    private lateinit var logoutButton: Button

    private var userName: String? = null
    private var userEmail: String? = null
    private var userId: Long = -1L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sessionManager = SessionManager(requireContext())
        userId = sessionManager.getUserId()
        userName = sessionManager.getUserName()
        userEmail = sessionManager.getUserEmail()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_profile_and_post, container, false)

        nameTextView = view.findViewById(R.id.textViewName)
        emailTextView = view.findViewById(R.id.textViewEmail)
        logoutButton = view.findViewById(R.id.btnLogout)
        recyclerView = view.findViewById(R.id.recyclerUserPosts)

        nameTextView.text = "Name: $userName"
        emailTextView.text = "Email: $userEmail"

        logoutButton.setOnClickListener {
            val sessionManager = SessionManager(requireContext())
            sessionManager.clearSession()

            val intent = Intent(requireContext(), LoginActivity::class.java)
            startActivity(intent)
            requireActivity().finish()
        }

        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = UserPostAdapter(listOf()) { post ->
            val detailFragment = PostDetailFragment.newInstance(
                post.content,
                post.imageUrl,
                post.createdAt ?: ""
            )
            parentFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, detailFragment) // Make sure this matches your activity layout's fragment container ID
                .addToBackStack(null)
                .commit()
        }
        recyclerView.adapter = adapter

        if (userId != -1L) {
            fetchUserPosts(userId)
        } else {
            Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
        }

        return view
    }

    private fun fetchUserPosts(userId: Long) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.getPostsByUser(userId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val postsRaw = response.body()?.get("posts") as? List<Map<String, Any>>
                        val posts = postsRaw?.mapNotNull {
                            val id = (it["id"] as? Double)?.toLong()
                            val content = it["content"] as? String
                            val createdAt = it["createdAt"] as? String
                            val imageUrl = it["imageUrl"] as? String
                            if (id != null && content != null) {
                                UserPost(id, content, createdAt, userName, imageUrl)
                            } else null
                        } ?: emptyList()

                        adapter.updateData(posts)
                    } else {
                        Toast.makeText(requireContext(), "Failed to load posts", Toast.LENGTH_SHORT).show()
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
