package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.Adapter.UserAdapter
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NetworkFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: UserAdapter  // ✅ Make sure this is declared

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_network, container, false)

        recyclerView = view.findViewById(R.id.recyclerViewUsers)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = UserAdapter(listOf())
        recyclerView.adapter = adapter

        fetchUsers()

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        recyclerView = view.findViewById(R.id.recyclerViewUsers)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = UserAdapter(emptyList())
        recyclerView.adapter = adapter

        fetchUsers() // Call the function here
    }

    private fun fetchUsers() {
        CoroutineScope(Dispatchers.IO).launch {
            val response = RetrofitInstance.api.getAllUsers()
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val usersRaw = response.body()?.get("users") as? List<Map<String, Any>>
                    val users = usersRaw?.mapNotNull {
                        val id = (it["id"] as? Double)?.toLong()
                        val name = it["name"] as? String
                        val email = it["email"] as? String
                        if (id != null && name != null && email != null) {
                            User(id, name, email)
                        } else null
                    } ?: emptyList()

                    adapter.updateData(users)
                } else {
                    Toast.makeText(requireContext(), "Failed to load users", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

}

