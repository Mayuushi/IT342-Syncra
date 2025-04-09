package edu.cit.syncra.Adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.R

class UserAdapter(private var userList: List<User>) :
    RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    class UserViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val userName: TextView = view.findViewById(R.id.textViewUserName)
        val userEmail: TextView = view.findViewById(R.id.textViewUserEmail)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        return UserViewHolder(view)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        val user = userList[position]
        holder.userName.text = user.name
        holder.userEmail.text = user.email
    }

    override fun getItemCount(): Int = userList.size

    // ✅ Add this function so fragments can update the list
    fun updateData(newList: List<User>) {
        userList = newList
        notifyDataSetChanged()
    }
}
