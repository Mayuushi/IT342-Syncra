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
import edu.cit.syncra.R
import edu.cit.syncra.adapter.NewsFeedAdapter
import edu.cit.syncra.databinding.FragmentHomeBinding
import edu.cit.syncra.network.RetrofitInstance
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

        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchPosts()
        }

        binding.createPost.setOnClickListener {
            parentFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, PostFragment())
                .addToBackStack(null)
                .commit()
        }

        fetchPosts()
    }

    private fun fetchPosts() {
        binding.swipeRefreshLayout.isRefreshing = true

        lifecycleScope.launch {
            try {
                val response = apiService.getAllPosts()
                if (response.isSuccessful) {
                    val posts = (response.body()
                        ?.get("posts") as? List<*>)?.filterIsInstance<Map<String, Any>>()
                        ?: emptyList()

                    val gson = com.google.gson.Gson()
                    val json = gson.toJson(posts)
                    val postList: List<NewsPostResponse> = gson.fromJson(
                        json,
                        object : com.google.gson.reflect.TypeToken<List<NewsPostResponse>>() {}.type
                    )

                    adapter.updateData(postList.shuffled())
                } else {
                    Log.e("HomeFragment", "Error: ${response.message()}")
                }
            } catch (e: Exception) {
                Log.e("HomeFragment", "Exception: ${e.message}", e)
            } finally {
                binding.swipeRefreshLayout.isRefreshing = false
            }
        }
    }
}
