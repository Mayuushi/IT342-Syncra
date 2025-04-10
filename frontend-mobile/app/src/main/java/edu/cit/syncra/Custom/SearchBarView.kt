package edu.cit.syncra.Custom

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.text.TextWatcher
import android.text.Editable
import edu.cit.syncra.R

class SearchBarView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : LinearLayout(context, attrs) {

    val searchEditText: EditText
    val searchIcon: ImageView

    init {
        LayoutInflater.from(context).inflate(R.layout.view_search_bar, this, true)
        searchEditText = findViewById(R.id.editSearch)
        searchIcon = findViewById(R.id.searchIcon)
    }

    fun setHint(text: String) {
        searchEditText.hint = text
    }

    fun onTextChanged(callback: (String) -> Unit) {
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                callback(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }
}
