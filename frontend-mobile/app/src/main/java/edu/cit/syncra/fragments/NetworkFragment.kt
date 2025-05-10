package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import edu.cit.syncra.network.RetrofitInstance
import edu.cit.syncra.adapter.UserAdapter
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.R
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NetworkFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: UserAdapter
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_network, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        recyclerView = view.findViewById(R.id.recyclerViewUsers)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        progressBar = view.findViewById(R.id.progressBar)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)

        adapter = UserAdapter(emptyList()) { selectedUser ->
            val fragment = UserProfileFragment().apply {
                arguments = Bundle().apply {
                    putString("userId", selectedUser.id)
                }
            }
            parentFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .addToBackStack(null)
                .commit()
        }

        recyclerView.adapter = adapter

        swipeRefreshLayout.setOnRefreshListener {
            fetchUsers(isRefreshing = true)
        }

        fetchUsers()
    }

    private fun fetchUsers(isRefreshing: Boolean = false) {
        val sessionManager = SessionManager(requireContext())
        val currentUserId = sessionManager.getUserId()

        if (!isRefreshing) progressBar.visibility = View.VISIBLE

        CoroutineScope(Dispatchers.IO).launch {
            val response = RetrofitInstance.api.getAllUsers()
            withContext(Dispatchers.Main) {
                if (!isRefreshing) progressBar.visibility = View.GONE
                if (isRefreshing) swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful) {
                    val usersRaw = response.body()?.get("users") as? List<Map<String, Any>>
                    val users = usersRaw?.mapNotNull {
                        val id = (it["id"] as? String) ?: (it["id"] as? Double)?.toString()
                        val name = it["name"] as? String
                        val email = it["email"] as? String
                        if (id != null && name != null && email != null) {
                            User(id, name, email)
                        } else null
                    }?.filter {
                        it.id != currentUserId
                    }?.shuffled() ?: emptyList()  // 🔀 Randomize list

                    adapter.updateData(users)
                } else {
                    Toast.makeText(requireContext(), "Failed to load users", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
