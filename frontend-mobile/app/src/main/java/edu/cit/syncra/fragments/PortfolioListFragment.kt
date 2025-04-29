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
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.R
import edu.cit.syncra.adapter.PortfolioAdapter
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PortfolioListFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var portfolioAdapter: PortfolioAdapter
    private var userId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sessionManager = SessionManager(requireContext())
        userId = sessionManager.getUserId()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_portfolio_list, container, false)

        recyclerView = view.findViewById(R.id.portfolioRecycler)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        portfolioAdapter = PortfolioAdapter(emptyList())
        recyclerView.adapter = portfolioAdapter

        fetchPortfolios()

        return view
    }

    private fun fetchPortfolios() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                if (userId.isNullOrEmpty()) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
                    }
                    return@launch
                }

                val response = RetrofitInstance.api.getPortfoliosByUser(userId!!)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val portfolios = response.body() ?: emptyList()
                        portfolioAdapter.updateData(portfolios)
                    } else {
                        Toast.makeText(requireContext(), "Failed to fetch portfolios", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

}
