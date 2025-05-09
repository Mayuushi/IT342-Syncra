package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.LinearLayout
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import edu.cit.syncra.R
import edu.cit.syncra.DataClass.Company
import edu.cit.syncra.network.RetrofitInstance
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.launch
import retrofit2.Response

class ViewCompanyFragment : Fragment() {

    private lateinit var companyListLayout: LinearLayout
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_view_company, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sessionManager = SessionManager(requireContext())
        val userId = sessionManager.getUserId()

        // Initialize layout container for company details
        companyListLayout = view.findViewById(R.id.companyListLayout)

        if (!userId.isNullOrEmpty()) {
            // Launch coroutine to fetch company data
            fetchCompanyData(userId)
        }
    }

    private fun fetchCompanyData(userId: String) {
        // Launch coroutine in the fragment's lifecycle scope
        lifecycleScope.launch {
            try {
                // Call the suspend function to fetch a list of companies
                val response: Response<List<Company>> = RetrofitInstance.api.getCompaniesByUserId(userId)

                if (response.isSuccessful) {
                    val companies = response.body()
                    if (!companies.isNullOrEmpty()) {
                        // Loop through the companies and display them
                        companies.forEach { company ->
                            addCompanyToLayout(company)
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()  // Handle exceptions (e.g., network errors)
            }
        }
    }

    private fun addCompanyToLayout(company: Company) {
        // Inflate company item layout and bind data
        val companyView = LayoutInflater.from(requireContext()).inflate(R.layout.item_company, companyListLayout, false)

        val tvCompanyName: TextView = companyView.findViewById(R.id.tvCompanyName)
        val tvIndustry: TextView = companyView.findViewById(R.id.tvIndustry)
        val tvLocation: TextView = companyView.findViewById(R.id.tvLocation)
        val tvSize: TextView = companyView.findViewById(R.id.tvSize)
        val tvFoundedDate: TextView = companyView.findViewById(R.id.tvFoundedDate)
        val tvWebsite: TextView = companyView.findViewById(R.id.tvWebsite)
        val tvEmail: TextView = companyView.findViewById(R.id.tvEmail)
        val tvPhone: TextView = companyView.findViewById(R.id.tvPhone)
        val tvDescription: TextView = companyView.findViewById(R.id.tvDescription)

        // Populate data for each company
        tvCompanyName.text = company.name
        tvIndustry.text = "Industry: ${company.industry}"
        tvLocation.text = "Location: ${company.location}"
        tvSize.text = "Size: ${company.size}"
        tvFoundedDate.text = "Founded: ${company.foundedDate?.substring(0, 10) ?: "N/A"}"
        tvWebsite.text = "Website: ${company.websiteUrl}"
        tvEmail.text = "Email: ${company.email}"
        tvPhone.text = "Phone: ${company.phone}"
        tvDescription.text = "Description: ${company.description}"

        // Add the inflated view to the layout container
        companyListLayout.addView(companyView)
    }
}
