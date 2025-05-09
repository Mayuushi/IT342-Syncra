package edu.cit.syncra.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.Company
import edu.cit.syncra.R

class CompanyAdapter(private val onItemClick: (Company) -> Unit) :
    RecyclerView.Adapter<CompanyAdapter.CompanyViewHolder>() {

    private var companies: List<Company> = listOf()

    class CompanyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val name: TextView = itemView.findViewById(R.id.tvCompanyName)
        val industry: TextView = itemView.findViewById(R.id.tvIndustry)
        val location: TextView = itemView.findViewById(R.id.tvLocation)
        val size: TextView = itemView.findViewById(R.id.tvSize)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CompanyViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_company, parent, false)
        return CompanyViewHolder(view)
    }

    override fun onBindViewHolder(holder: CompanyViewHolder, position: Int) {
        val company = companies[position]
        holder.name.text = company.name
        holder.industry.text = company.industry
        holder.location.text = company.location
        holder.size.text = company.size

        holder.itemView.setOnClickListener {
            onItemClick(company)
        }
    }

    override fun getItemCount(): Int = companies.size

    fun setCompanies(companies: List<Company>) {
        this.companies = companies
        notifyDataSetChanged()
    }
}

