package edu.cit.syncra.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("UserSession", Context.MODE_PRIVATE)

    companion object {
        private const val USER_ID = "userId"
        private const val NAME = "name"
        private const val EMAIL = "email"
    }

    fun saveUserSession(userId: String?, name: String?, email: String?) {
        with(prefs.edit()) {
            putString(USER_ID, userId)
            putString(NAME, name)
            putString(EMAIL, email)
            apply()
        }
    }

    fun getUserId(): String? = prefs.getString(USER_ID, null)

    fun getUserName(): String? = prefs.getString(NAME, "Unknown")

    fun getUserEmail(): String? = prefs.getString(EMAIL, null)

    fun clearSession() {
        prefs.edit().clear().apply()
    }

}
