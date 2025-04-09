package edu.cit.syncra

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.Adapter.UserPostAdapter
import edu.cit.syncra.DataClass.UserPost
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class UserPostsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: UserPostAdapter
    private var userName: String? = null
    private var userId: Long = -1L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_posts)

        recyclerView = findViewById(R.id.recyclerUserPosts)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = UserPostAdapter(listOf())
        recyclerView.adapter = adapter

        userId = intent.getLongExtra("USER_ID", -1L)
        userName = intent.getStringExtra("USER_NAME")

        if (userId != -1L) {
            fetchUserPosts(userId)
        } else {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show()
        }
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
                            if (id != null && content != null) {
                                UserPost(id, content, createdAt, userName)
                            } else null
                        } ?: emptyList()

                        adapter.updateData(posts)
                    } else {
                        Toast.makeText(this@UserPostsActivity, "Failed to load posts", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@UserPostsActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
