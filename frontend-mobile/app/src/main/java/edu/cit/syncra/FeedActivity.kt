package edu.cit.syncra

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.network.RetrofitInstance
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import edu.cit.syncra.Adapter.NewsFeedAdapter
import edu.cit.syncra.DataClass.NewsPostResponse
import edu.cit.syncra.DataClass.User
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class FeedActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: NewsFeedAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_feed)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)

        loadFeed()
    }

    private fun loadFeed() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val postResponse = RetrofitInstance.api.getAllPosts()
                val userResponse = RetrofitInstance.api.getAllUsers()

                if (postResponse.isSuccessful && userResponse.isSuccessful) {
                    val postsMap = postResponse.body()
                    val usersMap = userResponse.body()

                    val postsJson = Gson().toJson(postsMap?.get("posts"))
                    val usersJson = Gson().toJson(usersMap?.get("users"))

                    val postType = object : TypeToken<List<NewsPostResponse>>() {}.type
                    val userType = object : TypeToken<List<User>>() {}.type

                    val posts: List<NewsPostResponse> = Gson().fromJson(postsJson, postType)
                    val users: List<User> = Gson().fromJson(usersJson, userType)

                    withContext(Dispatchers.Main) {
                        adapter = NewsFeedAdapter(posts, users)
                        recyclerView.adapter = adapter
                    }

                } else {
                    Log.e("FeedActivity", "Failed to fetch posts or users")
                }

            } catch (e: Exception) {
                Log.e("FeedActivity", "Error loading feed: ${e.message}")
            }
        }
    }
}
