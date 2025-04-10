package edu.cit.syncra.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.syncra.DataClass.Portfolio
import edu.cit.syncra.R

import coil.load
import edu.cit.syncra.databinding.ItemPortfolioBinding

class PortfolioAdapter(private var portfolioList: List<Portfolio>) : RecyclerView.Adapter<PortfolioAdapter.PortfolioViewHolder>() {

    // Method to update the data in the adapter
    fun updateData(newPortfolioList: List<Portfolio>) {
        portfolioList = newPortfolioList
        notifyDataSetChanged()  // Notify the adapter that the data has changed
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PortfolioViewHolder {
        val binding = ItemPortfolioBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return PortfolioViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PortfolioViewHolder, position: Int) {
        val item = portfolioList[position]
        holder.title.text = item.projectTitle
        holder.description.text = item.description

        // Use Coil to load the image
        holder.image.load(item.imageUrl) {
            crossfade(true)
            placeholder(R.drawable.ic_profile) // Optional placeholder
        }
    }

    override fun getItemCount(): Int {
        return portfolioList.size
    }

    class PortfolioViewHolder(binding: ItemPortfolioBinding) : RecyclerView.ViewHolder(binding.root) {
        val title: TextView = binding.root.findViewById(R.id.textPortfolioTitle)
        val description: TextView = binding.root.findViewById(R.id.textPortfolioDescription)
        val image: ImageView = binding.root.findViewById(R.id.imagePortfolio)
    }
}


