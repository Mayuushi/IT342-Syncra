package edu.cit.syncra.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import coil.load
import edu.cit.syncra.DataClass.UserPost
import edu.cit.syncra.R

class UserPostAdapter(
    private var posts: List<UserPost>,
    private val onItemClick: (UserPost) -> Unit
) : RecyclerView.Adapter<UserPostAdapter.PostViewHolder>() {

    inner class PostViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textContent: TextView = itemView.findViewById(R.id.textPostContent)
        val textDate: TextView = itemView.findViewById(R.id.textPostDate)
        val imagePost: ImageView = itemView.findViewById(R.id.imagePost)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_user_post, parent, false)
        return PostViewHolder(view)
    }

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        val post = posts[position]
        holder.textContent.text = post.content
        holder.textDate.text = post.createdAt ?: ""

        if (!post.imageUrl.isNullOrEmpty()) {
            holder.imagePost.visibility = View.VISIBLE
            holder.imagePost.load(post.imageUrl)
        } else {
            holder.imagePost.visibility = View.GONE
        }

        holder.itemView.setOnClickListener {
            onItemClick(post)
        }
    }

    override fun getItemCount(): Int = posts.size

    fun updateData(newPosts: List<UserPost>) {
        posts = newPosts
        notifyDataSetChanged()
    }
}
