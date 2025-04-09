package edu.cit.syncra.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.NewsPostResponse
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.databinding.ItemNewsFeedBinding

class NewsFeedAdapter(
    private val posts: List<NewsPostResponse>,
    private val users: List<User> // Preloaded list of all users
) : RecyclerView.Adapter<NewsFeedAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemNewsFeedBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(post: NewsPostResponse) {
            binding.tvContent.text = post.content
            binding.tvTimestamp.text = post.timestamp

            // Match userId to find the user's name
            val user = users.find { it.id == post.userId }
            binding.tvUsername.text = user?.name ?: "Unknown User"
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemNewsFeedBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun getItemCount(): Int = posts.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(posts[position])
    }
}
