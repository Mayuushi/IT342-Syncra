package edu.cit.syncra.fragments

import android.os.Bundle
import android.util.TypedValue
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import coil.load // You can keep this if you want to use it for loading images directly
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class UserProfileFragment : Fragment() {

    private lateinit var nameTextView: TextView
    private lateinit var emailTextView: TextView
    private lateinit var portfolioContainer: LinearLayout

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
        portfolioContainer = view.findViewById(R.id.portfolioContainer)

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
                val response = RetrofitInstance.api.getAllUsers()  // No getUserById in your API
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
                        displayPortfolios(portfolios)
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

    private fun displayPortfolios(portfolios: List<Portfolio>) {
        portfolioContainer.removeAllViews()

        if (portfolios.isEmpty()) {
            val textView = TextView(requireContext())
            textView.text = "No portfolio entries"
            portfolioContainer.addView(textView)
        } else {
            portfolios.forEach { portfolio ->
                // Create a new LinearLayout to hold the portfolio info
                val portfolioLayout = LinearLayout(requireContext())
                portfolioLayout.orientation = LinearLayout.VERTICAL
                portfolioLayout.setPadding(16, 16, 16, 16)

                // Title and Description TextViews
                val titleTextView = TextView(requireContext())
                titleTextView.text = portfolio.projectTitle
                titleTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
                titleTextView.setPadding(0, 0, 0, 8)

                val descriptionTextView = TextView(requireContext())
                descriptionTextView.text = portfolio.description
                descriptionTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
                descriptionTextView.setPadding(0, 0, 0, 8)

                // Add TextViews to portfolio layout
                portfolioLayout.addView(titleTextView)
                portfolioLayout.addView(descriptionTextView)

                // Image handling
                portfolio.imageUrl?.let { imageUrl ->
                    val imageView = ImageView(requireContext())
                    imageView.layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                    imageView.load(imageUrl) {
                        crossfade(true)
                        placeholder(R.drawable.ic_profile) // Optional placeholder
                    }
                    portfolioLayout.addView(imageView)
                }

                // Add the portfolio layout to the container
                portfolioContainer.addView(portfolioLayout)
            }
        }
    }
}
