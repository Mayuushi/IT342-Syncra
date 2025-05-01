package edu.cit.syncra.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import coil.load
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.R

class PortfolioAdapter(private var portfolios: List<Portfolio>) :
    RecyclerView.Adapter<PortfolioAdapter.PortfolioViewHolder>() {

    inner class PortfolioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleText: TextView = itemView.findViewById(R.id.textPortfolioTitle)
        val descText: TextView = itemView.findViewById(R.id.textPortfolioDescription)
        val imageView: ImageView = itemView.findViewById(R.id.imagePortfolio)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PortfolioViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.portfolio_card, parent, false)
        return PortfolioViewHolder(view)
    }

    override fun onBindViewHolder(holder: PortfolioViewHolder, position: Int) {
        val portfolio = portfolios[position]
        holder.titleText.text = portfolio.projectTitle
        holder.descText.text = portfolio.description

        if (!portfolio.imageUrl.isNullOrEmpty()) {
            holder.imageView.visibility = View.VISIBLE
            holder.imageView.load(portfolio.imageUrl)
        } else {
            holder.imageView.visibility = View.GONE
        }
    }

    override fun getItemCount(): Int = portfolios.size

    fun updateData(newList: List<Portfolio>) {
        portfolios = newList
        notifyDataSetChanged()
    }
}
