package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.LinearLayout
import android.widget.Toast
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

        companyListLayout = view.findViewById(R.id.companyListLayout)

        if (!userId.isNullOrEmpty()) {
            fetchCompanyData(userId)
        }
    }

    private fun fetchCompanyData(userId: String) {
        lifecycleScope.launch {
            try {
                val response: Response<List<Company>> = RetrofitInstance.api.getCompaniesByUserId(userId)

                if (response.isSuccessful) {
                    val companies = response.body()
                    if (!companies.isNullOrEmpty()) {
                        companyListLayout.removeAllViews() // Clear existing views before adding new ones
                        companies.forEach { company ->
                            addCompanyToLayout(company)
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(requireContext(), "Failed to fetch companies", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun addCompanyToLayout(company: Company) {
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
        val btnDelete: Button = companyView.findViewById(R.id.btnDeleteCompany)

        // Populate company data
        tvCompanyName.text = company.name
        tvIndustry.text = "Industry: ${company.industry}"
        tvLocation.text = "Location: ${company.location}"
        tvSize.text = "Size: ${company.size}"
        tvFoundedDate.text = "Founded: ${company.foundedDate?.substring(0, 10) ?: "N/A"}"
        tvWebsite.text = "Website: ${company.websiteUrl}"
        tvEmail.text = "Email: ${company.email}"
        tvPhone.text = "Phone: ${company.phone}"
        tvDescription.text = "Description: ${company.description}"

        // Set delete action
        btnDelete.setOnClickListener {
            deleteCompany(company.id.toString())
        }

        companyListLayout.addView(companyView)
    }

    private fun deleteCompany(companyId: String) {
        val userId = sessionManager.getUserId()

        if (userId.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "User ID not found", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.deleteCompany(companyId, userId)

                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Company deleted", Toast.LENGTH_SHORT).show()
                    fetchCompanyData(userId)
                } else {
                    Toast.makeText(requireContext(), "Failed to delete company", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(requireContext(), "Error occurred", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
