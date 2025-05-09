package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import edu.cit.syncra.DataClass.Job
import edu.cit.syncra.R
import edu.cit.syncra.adapter.JobAdapter
import edu.cit.syncra.databinding.FragmentAllJobsBinding
import edu.cit.syncra.network.RetrofitInstance
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.launch

class AllJobsFragment : Fragment() {

    private lateinit var binding: FragmentAllJobsBinding
    private lateinit var jobAdapter: JobAdapter
    private lateinit var sessionManager: SessionManager
    private val apiService = RetrofitInstance.api

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout without using data binding
        val view = inflater.inflate(R.layout.fragment_all_jobs, container, false)
        sessionManager = SessionManager(requireContext())
        setupRecyclerView(view)
        fetchAllJobs(view)
        return view
    }

    private fun setupRecyclerView(view: View) {
        jobAdapter = JobAdapter { jobId ->
            // Call the applyToJob method when the Apply button is clicked
            applyToJob(jobId)
        }

        val recyclerViewJobs = view.findViewById<androidx.recyclerview.widget.RecyclerView>(R.id.recyclerViewJobs)
        recyclerViewJobs.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = jobAdapter
        }
    }

    private fun fetchAllJobs(view: View) {
        lifecycleScope.launch {
            try {
                val response = apiService.getAllJobs()
                if (response.isSuccessful) {
                    val jobsMap = response.body()?.get("jobs") as? List<Map<String, Any>>
                    val jobs = jobsMap?.mapNotNull {
                        try {
                            Job(
                                id = it["id"].toString(),
                                title = it["title"].toString(),
                                description = it["description"].toString(),
                                company = it["company"].toString(),
                                location = it["location"].toString(),
                                type = it["type"].toString(),
                                postedDate = it["postedDate"].toString(),
                                isApplied = false // Initialize isApplied to false (or based on user data)
                            )
                        } catch (e: Exception) {
                            null
                        }
                    } ?: emptyList()

                    jobAdapter.submitList(jobs)
                } else {
                    Toast.makeText(context, "Failed to load jobs", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun applyToJob(jobId: String) {
        val userId = sessionManager.getUserId()
        if (userId.isNullOrEmpty()) {
            Toast.makeText(context, "User not logged in", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val response = apiService.applyForJob(userId, jobId)
                if (response.isSuccessful) {
                    Toast.makeText(context, "Applied to job successfully", Toast.LENGTH_SHORT).show()
                    // After applying, you may need to update the job list or job status
                    fetchAllJobs(requireView()) // Refresh the job list
                } else {
                    Toast.makeText(context, "Failed to apply: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

