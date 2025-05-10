package edu.cit.syncra.fragments

import android.app.DatePickerDialog
import androidx.fragment.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import edu.cit.syncra.DataClass.Company
import edu.cit.syncra.R
import edu.cit.syncra.databinding.FragmentCreateCompanyBinding
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import edu.cit.syncra.network.RetrofitInstance

class CreateCompanyFragment : Fragment() {

    private var _binding: FragmentCreateCompanyBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private var selectedDate: Date? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCreateCompanyBinding.inflate(inflater, container, false)
        sessionManager = SessionManager(requireContext())

        binding.btnSelectDate.setOnClickListener {
            showDatePicker()
        }

        binding.btnCreateCompany.setOnClickListener {
            createCompany()
        }


        binding.btnViewMyCompany.setOnClickListener {
            requireActivity().supportFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, ViewCompanyFragment())
                .addToBackStack(null)
                .commit()
        }


        return binding.root
    }

    private fun showDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            requireContext(),
            { _, year, month, day ->
                calendar.set(year, month, day)
                selectedDate = calendar.time
                val formattedDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(selectedDate!!)
                binding.tvSelectedDate.text = formattedDate
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun createCompany() {
        val userId = sessionManager.getUserId()
        if (userId.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "User ID not found.", Toast.LENGTH_SHORT).show()
            return
        }

        // Format the date before sending it to the backend
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val formattedDate = selectedDate?.let { sdf.format(it) }

        val company = Company(
            id = null,
            name = binding.etName.text.toString(),
            description = binding.etDescription.text.toString(),
            websiteUrl = binding.etWebsite.text.toString(),
            logoUrl = binding.etLogoUrl.text.toString(),
            industry = binding.etIndustry.text.toString(),
            location = binding.etLocation.text.toString(),
            size = binding.etSize.text.toString(),
            foundedDate = formattedDate,  // Use the formatted date here
            email = binding.etEmail.text.toString(),
            phone = binding.etPhone.text.toString(),
        )

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.api.createCompany(userId, company)
                requireActivity().runOnUiThread {
                    if (response.isSuccessful) {
                        val createdCompany = response.body()
                        val companyId = createdCompany?.id
                        if (companyId != null) {
                            val fragment = ViewCompanyFragment()
                            val bundle = Bundle().apply {
                                putString("company_id", companyId)
                            }
                            fragment.arguments = bundle

                            requireActivity().supportFragmentManager.beginTransaction()
                                .replace(R.id.fragment_container, fragment)
                                .addToBackStack(null)
                                .commit()
                        } else {
                            Toast.makeText(requireContext(), "Company created, but no ID returned.", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to create company.", Toast.LENGTH_SHORT).show()
                    }

                }
            } catch (e: Exception) {
                requireActivity().runOnUiThread {
                    Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }





}
