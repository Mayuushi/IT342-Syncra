package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.viewmodel.JobViewModel
import edu.cit.syncra.adapter.JobAdapter
import edu.cit.syncra.R
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.launch

class SavedJobsFragment : Fragment() {

    private lateinit var viewModel: JobViewModel
    private lateinit var adapter: JobAdapter
    private lateinit var sessionManager: SessionManager


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_saved_jobs, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sessionManager = SessionManager(requireContext()) // Initialize session manager

        val userId = sessionManager.getUserId()
        if (userId.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "User is not logged in.", Toast.LENGTH_SHORT).show()
            return
        }

        val recyclerView = view.findViewById<RecyclerView>(R.id.savedJobsRecyclerView)
        adapter = JobAdapter(isAppliedJob = false)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        recyclerView.adapter = adapter

        viewModel = ViewModelProvider(this).get(JobViewModel::class.java)

        // Collect saved and applied jobs, and combine them
        lifecycleScope.launch {
            viewModel.savedJobs.collect { savedJobs ->
                viewModel.appliedJobs.collect { appliedJobs ->
                    // Combine both lists (saved and applied jobs)
                    val combinedJobs = savedJobs + appliedJobs
                    adapter.submitList(combinedJobs)  // Submit combined list to the adapter
                }
            }
        }

        // Collect message StateFlow and show a toast if a message is emitted
        lifecycleScope.launch {
            viewModel.message.collect { msg ->
                msg?.let {
                    Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
                }
            }
        }

        // Fetch saved jobs and applied jobs for the logged-in user
        viewModel.fetchSavedJobs(userId)
        viewModel.fetchAppliedJobs(userId)
    }
}
