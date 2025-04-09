package edu.cit.syncra

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.User
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NetworkActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var userAdapter: UserAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_network)

        recyclerView = findViewById(R.id.recyclerViewUsers)
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Fetch the users
        fetchUsers()
    }

    private fun fetchUsers() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.getAllUsers()

                if (response.isSuccessful) {
                    val body = response.body()
                    val users = (body?.get("users") as? List<Map<String, Any>>)?.mapNotNull {
                        val userEmail = it["email"] as? String
                        val userName = it["name"] as? String
                        val userId = (it["id"] as? Number)?.toLong()

                        if (userEmail != null && userName != null && userId != null) {
                            User(id = userId, name = userName, email = userEmail, password = "")
                        } else null
                    } ?: emptyList()

                    // Set the adapter with the list of users
                    withContext(Dispatchers.Main) {
                        userAdapter = UserAdapter(users)
                        recyclerView.adapter = userAdapter
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@NetworkActivity, "Failed to retrieve users", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@NetworkActivity, "Network error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
