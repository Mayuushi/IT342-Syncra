package edu.cit.syncra

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.UserPost

class UserPostAdapter(private var posts: List<UserPost>) :
    RecyclerView.Adapter<UserPostAdapter.PostViewHolder>() {

    class PostViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val postContent: TextView = itemView.findViewById(R.id.textPostContent)
        val postDate: TextView = itemView.findViewById(R.id.textPostDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.item_user_post, parent, false)
        return PostViewHolder(view)
    }

    override fun getItemCount(): Int = posts.size

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        val post = posts[position]
        holder.postContent.text = post.content
        holder.postDate.text = post.createdAt ?: "No date"
    }

    fun updateData(newPosts: List<UserPost>) {
        posts = newPosts
        notifyDataSetChanged()
    }
}
