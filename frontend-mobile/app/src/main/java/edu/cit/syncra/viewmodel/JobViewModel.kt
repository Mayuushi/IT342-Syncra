package edu.cit.syncra.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import edu.cit.syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class JobViewModel : ViewModel() {

    private val _savedJobs = MutableStateFlow<List<Job>>(emptyList())
    val savedJobs: StateFlow<List<Job>> = _savedJobs

    private val _appliedJobs = MutableStateFlow<List<Job>>(emptyList())
    val appliedJobs: StateFlow<List<Job>> = _appliedJobs

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message

    // Fetch saved jobs
    fun fetchSavedJobs(userId: String) {
        viewModelScope.launch {
            val response = RetrofitInstance.api.getSavedJobs(userId)
            if (response.isSuccessful) {
                val jobs = response.body()?.get("savedJobs") as? List<Map<String, Any>> ?: emptyList()
                _savedJobs.value = jobs.map { jobMap ->
                    Job(
                        id = jobMap["id"] as? String ?: "",
                        title = jobMap["title"] as? String ?: "",
                        description = jobMap["description"] as? String ?: "",
                        company = jobMap["company"] as? String ?: "",
                        location = jobMap["location"] as? String ?: "",
                        type = jobMap["type"] as? String ?: "",
                        postedDate = jobMap["postedDate"] as? String ?: ""
                    )
                }
            }
        }
    }

    // Fetch applied jobs
    fun fetchAppliedJobs(userId: String) {
        viewModelScope.launch {
            val response = RetrofitInstance.api.getAppliedJobs(userId)
            if (response.isSuccessful) {
                val jobs = response.body()?.get("appliedJobs") as? List<Map<String, Any>> ?: emptyList()
                _appliedJobs.value = jobs.map { jobMap ->
                    Job(
                        id = jobMap["id"] as? String ?: "",
                        title = jobMap["title"] as? String ?: "",
                        description = jobMap["description"] as? String ?: "",
                        company = jobMap["company"] as? String ?: "",
                        location = jobMap["location"] as? String ?: "",
                        type = jobMap["type"] as? String ?: "",
                        postedDate = jobMap["postedDate"] as? String ?: ""
                    )
                }
            }
        }
    }

    // Handle job application and saving/removal logic
    fun applyForJob(userId: String, jobId: String) {
        viewModelScope.launch {
            val response = RetrofitInstance.api.applyForJob(userId, jobId)
            _message.value = response.body()?.get("message") as? String
        }
    }

    fun saveJob(userId: String, jobId: String) {
        viewModelScope.launch {
            val response = RetrofitInstance.api.saveJob(userId, jobId)
            _message.value = response.body()?.get("message") as? String
        }
    }

    fun removeSavedJob(userId: String, jobId: String) {
        viewModelScope.launch {
            val response = RetrofitInstance.api.removeSavedJob(userId, jobId)
            _message.value = response.body()?.get("message") as? String
        }
    }

    fun clearMessage() {
        _message.value = null
    }
}
