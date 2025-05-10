package edu.cit.syncra

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import edu.cit.syncra.fragments.AllJobsFragment
import edu.cit.syncra.fragments.CreateCompanyFragment
import edu.cit.syncra.fragments.HomeFragment
import edu.cit.syncra.fragments.NetworkFragment
import edu.cit.syncra.fragments.PostFragment
import edu.cit.syncra.fragments.ProfileAndPostsFragment

class LandingPageActivity : AppCompatActivity() {

    private lateinit var bottomNav: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_homepage)

        bottomNav = findViewById(R.id.bottomNav)

        // Load default fragment
        loadFragment(HomeFragment())

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> loadFragment(HomeFragment())
                R.id.nav_network -> loadFragment(NetworkFragment())
                R.id.nav_post -> loadFragment(CreateCompanyFragment())
                R.id.nav_profile -> {
                    loadFragment(ProfileAndPostsFragment()) // if you’ve made a fragment for posts
                    // or use a sharedPref check like before and pass data via bundle
                    true
                }
                R.id.nav_jobs -> {
                    loadFragment(AllJobsFragment()) // if this is also network
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment): Boolean {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
        return true
    }
}
