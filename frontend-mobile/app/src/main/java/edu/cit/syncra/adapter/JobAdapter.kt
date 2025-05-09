package edu.cit.syncra.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.Job
import edu.cit.syncra.R

class JobAdapter(private val isAppliedJob: Boolean) : ListAdapter<Job, JobAdapter.JobViewHolder>(JobDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JobViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_job, parent, false)
        return JobViewHolder(view)
    }

    override fun onBindViewHolder(holder: JobViewHolder, position: Int) {
        val job = getItem(position)
        holder.bind(job, isAppliedJob)
    }

    class JobViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val jobTitle = itemView.findViewById<TextView>(R.id.jobTitle)
        private val jobDescription = itemView.findViewById<TextView>(R.id.jobDescription)
        private val jobCompany = itemView.findViewById<TextView>(R.id.jobCompany)
        private val jobLocation = itemView.findViewById<TextView>(R.id.jobLocation)
        private val jobType = itemView.findViewById<TextView>(R.id.jobType)
        private val jobPostedDate = itemView.findViewById<TextView>(R.id.jobPostedDate)
        private val cancelApplicationButton = itemView.findViewById<Button>(R.id.cancelApplicationButton)

        fun bind(job: Job, isAppliedJob: Boolean) {
            jobTitle.text = job.title
            jobDescription.text = job.description
            jobCompany.text = job.company
            jobLocation.text = job.location
            jobType.text = job.type
            jobPostedDate.text = job.postedDate

            // Show the cancel button if the job is applied
            cancelApplicationButton.visibility = if (isAppliedJob) View.VISIBLE else View.GONE

            // Handle the cancel application button click if job is applied
            if (isAppliedJob) {
                cancelApplicationButton.setOnClickListener {
                    // Trigger ViewModel to remove the job from applied jobs
                    // For example: jobViewModel.removeAppliedJob(job.id)
                }
            }
        }
    }

    class JobDiffCallback : DiffUtil.ItemCallback<Job>() {
        override fun areItemsTheSame(oldItem: Job, newItem: Job): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Job, newItem: Job): Boolean {
            return oldItem == newItem
        }
    }
}

