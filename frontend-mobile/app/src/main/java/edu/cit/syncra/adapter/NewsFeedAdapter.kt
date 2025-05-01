package edu.cit.syncra.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import coil.load
import com.edu.cit.Syncra.DataClass.NewsPostResponse
import edu.cit.syncra.databinding.ItemNewsFeedBinding
import edu.cit.syncra.R

class NewsFeedAdapter(
    private val posts: MutableList<NewsPostResponse>
) : RecyclerView.Adapter<NewsFeedAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemNewsFeedBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(post: NewsPostResponse) {
            // Set content text
            binding.tvContent.text = post.content
            binding.tvTimestamp.text = post.createdAt ?: "Unknown Time"
            binding.tvUsername.text = post.user.name

            // Load post image only if it exists
            if (!post.imageUrl.isNullOrEmpty()) {
                binding.ivPostImage.visibility = View.VISIBLE
                binding.ivPostImage.load(post.imageUrl) {
                    crossfade(true)
                    placeholder(R.drawable.ic_profile) // Replace with your own placeholder drawable
                    error(R.drawable.ic_profile) // Replace with your own error drawable
                }
            } else {
                binding.ivPostImage.visibility = View.GONE
            }

            // Optionally: load user profile image if available
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

    fun updateData(newPosts: List<NewsPostResponse>) {
        posts.clear()
        posts.addAll(newPosts)
        notifyDataSetChanged()
    }
}
