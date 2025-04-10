package edu.cit.syncra.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import coil.load
import edu.cit.syncra.R

class PostDetailFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_post_detail, container, false)

        val textContent = view.findViewById<TextView>(R.id.detailTextContent)
        val imageView = view.findViewById<ImageView>(R.id.detailImagePost)
        val textDate = view.findViewById<TextView>(R.id.detailTextDate)

        val content = arguments?.getString("content")
        val imageUrl = arguments?.getString("imageUrl")
        val date = arguments?.getString("date")

        textContent.text = content
        textDate.text = date

        if (!imageUrl.isNullOrEmpty()) {
            imageView.visibility = View.VISIBLE
            imageView.load(imageUrl)
        } else {
            imageView.visibility = View.GONE
        }

        return view
    }

    companion object {
        fun newInstance(content: String, imageUrl: String?, date: String): PostDetailFragment {
            val fragment = PostDetailFragment()
            val args = Bundle()
            args.putString("content", content)
            args.putString("imageUrl", imageUrl)
            args.putString("date", date)
            fragment.arguments = args
            return fragment
        }
    }
}
