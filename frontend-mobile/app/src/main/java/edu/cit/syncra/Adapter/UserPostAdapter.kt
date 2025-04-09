package edu.cit.syncra.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.UserPost
import edu.cit.syncra.databinding.ItemNewsFeedBinding

class UserPostAdapter(private var posts: List<UserPost>) :
    RecyclerView.Adapter<UserPostAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemNewsFeedBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(post: UserPost) {
            binding.tvUsername.text = post.userName ?: "Unknown"
            binding.tvContent.text = post.content
            binding.tvTimestamp.text = post.createdAt ?: ""
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

    fun updateData(newPosts: List<UserPost>) {
        posts = newPosts
        notifyDataSetChanged()
    }
}
