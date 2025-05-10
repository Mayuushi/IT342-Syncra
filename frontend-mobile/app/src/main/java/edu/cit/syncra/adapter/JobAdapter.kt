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


class JobAdapter(
    private val onApplyClicked: (String) -> Unit // Callback when apply is clicked
) : ListAdapter<Job, JobAdapter.JobViewHolder>(JobDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JobViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_job, parent, false)
        return JobViewHolder(view)
    }

    override fun onBindViewHolder(holder: JobViewHolder, position: Int) {
        val job = getItem(position)
        holder.bind(job, onApplyClicked)
    }

    class JobViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val jobTitle = itemView.findViewById<TextView>(R.id.jobTitle)
        private val jobDescription = itemView.findViewById<TextView>(R.id.jobDescription)
        private val jobCompany = itemView.findViewById<TextView>(R.id.jobCompany)
        private val jobLocation = itemView.findViewById<TextView>(R.id.jobLocation)
        private val jobType = itemView.findViewById<TextView>(R.id.jobType)
        private val jobPostedDate = itemView.findViewById<TextView>(R.id.jobPostedDate)
        private val applyButton = itemView.findViewById<Button>(R.id.applyButton)
        private val cancelApplicationButton = itemView.findViewById<Button>(R.id.cancelApplicationButton)

        fun bind(job: Job, onApplyClicked: (String) -> Unit) {
            jobTitle.text = job.title
            jobDescription.text = job.description
            jobCompany.text = job.company
            jobLocation.text = job.location

            // Show apply button if not already applied
            applyButton.visibility = if (job.isApplied) View.GONE else View.VISIBLE
            cancelApplicationButton.visibility = if (job.isApplied) View.VISIBLE else View.GONE

            applyButton.setOnClickListener {
                // Trigger the apply callback when the button is clicked
                onApplyClicked(job.id)
            }

            // Handle cancel application if needed
            cancelApplicationButton.setOnClickListener {
                // Add logic to cancel application if necessary
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

