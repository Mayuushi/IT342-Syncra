package edu.cit.syncra

import android.content.Intent
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.method.LinkMovementMethod
import android.text.style.ClickableSpan
import android.text.style.ForegroundColorSpan
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.SignInButton
import com.google.android.gms.common.api.ApiException

class LoginActivity : AppCompatActivity() {

    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 1000

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize Google Sign-In options
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken("1007028414901-ttbv4qo04m6dq7nbcotv22ht5njhoe2c.apps.googleusercontent.com") // Replace with your actual web client ID
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)

        // Check if the user is already signed in
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null) {
            // User is signed in, navigate to HomeActivity
            goToHomePage()
        }

        val googleSignInButton: SignInButton = findViewById(R.id.btn_google_signin)
        googleSignInButton.setSize(SignInButton.SIZE_WIDE)

        googleSignInButton.setOnClickListener {
            val signInIntent = googleSignInClient.signInIntent
            startActivityForResult(signInIntent, RC_SIGN_IN)
        }

        // Handle the Forgot Password TextView click
        val forgotPasswordText: TextView = findViewById(R.id.forgotPasswordText)
        forgotPasswordText.setOnClickListener {
            // Redirect to HomePageActivity (or your desired page)
            val intent = Intent(this, HomePageActivity::class.java)
            startActivity(intent)
            finish() // Close MainActivity if you don't want the user to return
        }

        val signUpText: TextView = findViewById(R.id.signUpText)
        signUpText.setOnClickListener {
            // Redirect to HomePageActivity (or your desired page)
            val intent = Intent(this, HomePageActivity::class.java)
            startActivity(intent)
            finish() // Close MainActivity if you don't want the user to return
        }



    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account?.idToken

                Log.d("GOOGLE_SIGN_IN", "ID Token: $idToken")

                // User is signed in, navigate to HomeActivity
                goToHomePage()
            } catch (e: ApiException) {
                Log.w("GOOGLE_SIGN_IN", "Sign-in failed", e)
            }
        }
    }

    private fun goToHomePage() {
        // Start the homepage activity
        val intent = Intent(this, HomePageActivity::class.java)
        startActivity(intent)
        finish() // Close the current activity (MainActivity)
    }
}
