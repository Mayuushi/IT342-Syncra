package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.R
import edu.cit.syncra.adapter.PortfolioAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class UserProfileFragment : Fragment() {

    private lateinit var nameTextView: TextView
    private lateinit var emailTextView: TextView
    private lateinit var recyclerView: RecyclerView
    private lateinit var portfolioAdapter: PortfolioAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_user_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        nameTextView = view.findViewById(R.id.textViewUserName)
        emailTextView = view.findViewById(R.id.textViewUserEmail)
        recyclerView = view.findViewById(R.id.recyclerViewPortfolio)

        portfolioAdapter = PortfolioAdapter(emptyList())
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        recyclerView.adapter = portfolioAdapter

        val userId = arguments?.getString("userId")
        if (userId != null) {
            fetchUserProfile(userId)
            fetchUserPortfolio(userId)
        } else {
            Toast.makeText(requireContext(), "User ID missing", Toast.LENGTH_SHORT).show()
        }
    }

    private fun fetchUserProfile(userId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.getAllUsers()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val usersRaw = response.body()?.get("users") as? List<Map<String, Any>>
                        val user = usersRaw?.find {
                            val id = (it["id"] as? String) ?: (it["id"] as? Double)?.toString()
                            id == userId
                        }

                        if (user != null) {
                            val name = user["name"] as? String ?: "N/A"
                            val email = user["email"] as? String ?: "N/A"
                            nameTextView.text = name
                            emailTextView.text = email
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load user", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun fetchUserPortfolio(userId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.getPortfoliosByUser(userId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val portfolios = response.body() ?: emptyList()
                        portfolioAdapter.updateData(portfolios)
                    } else {
                        Toast.makeText(requireContext(), "Failed to load portfolio", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(requireContext(), "Error loading portfolio", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
