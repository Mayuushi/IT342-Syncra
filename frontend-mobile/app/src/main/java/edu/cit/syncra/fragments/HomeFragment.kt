package edu.cit.syncra.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.edu.cit.Syncra.DataClass.NewsPostResponse
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.adapter.NewsFeedAdapter
import edu.cit.syncra.databinding.FragmentHomeBinding
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {
    private lateinit var binding: FragmentHomeBinding
    private lateinit var adapter: NewsFeedAdapter
    private val apiService = RetrofitInstance.api

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = NewsFeedAdapter(mutableListOf())
        binding.recyclerView.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerView.adapter = adapter

        lifecycleScope.launch {
            try {
                val response = apiService.getAllPosts()
                if (response.isSuccessful) {
                    // Log the raw response to see if it’s correctly structured
                    Log.d("HomeFragment", "Response: ${response.body()}")

                    // Get the posts as a List of Map<String, Any>
                    val posts = (response.body()
                        ?.get("posts") as? List<*>)?.filterIsInstance<Map<String, Any>>()
                        ?: emptyList()

                    // Log the posts to verify the data before deserialization
                    Log.d("HomeFragment", "Posts Data: $posts")

                    // Use Gson to map the list properly
                    val gson = com.google.gson.Gson()
                    val json = gson.toJson(posts)
                    val postList: List<NewsPostResponse> = gson.fromJson(
                        json,
                        object : com.google.gson.reflect.TypeToken<List<NewsPostResponse>>() {}.type
                    )

                    // Log the final deserialized data
                    Log.d("HomeFragment", "Post List: $postList")

                    // Update the adapter with the posts
                    adapter.updateData(postList)
                } else {
                    // handle error
                    Log.e("HomeFragment", "Error: ${response.message()}")
                }
            } catch (e: Exception) {
                // Log the exception if there's one
                Log.e("HomeFragment", "Exception: ${e.message}", e)
            }
        }


    }
}
