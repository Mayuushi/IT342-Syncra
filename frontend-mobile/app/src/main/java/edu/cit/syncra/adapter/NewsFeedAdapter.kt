package edu.cit.syncra.adapter


import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.DataClass.NewsPostResponse
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.databinding.ItemNewsFeedBinding

class NewsFeedAdapter(
    private val posts: MutableList<NewsPostResponse>
) : RecyclerView.Adapter<NewsFeedAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemNewsFeedBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(post: NewsPostResponse) {
            binding.tvContent.text = post.content
            binding.tvTimestamp.text = post.createdAt ?: "Unknown Time"
            binding.tvUsername.text = post.user.name
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


