package edu.cit.syncra

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.edu.cit.Syncra.network.RetrofitInstance
import edu.cit.syncra.DataClass.User
import edu.cit.syncra.databinding.FragmentUpdateUserBinding
import edu.cit.syncra.utils.SessionManager
import kotlinx.coroutines.launch

class UpdateUserFragment : Fragment() {

    private var _binding: FragmentUpdateUserBinding? = null
    private val binding get() = _binding!!

    private lateinit var sessionManager: SessionManager

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentUpdateUserBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sessionManager = SessionManager(requireContext())
        val userId = sessionManager.getUserId()

        if (userId.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "User not logged in", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnUpdateUser.setOnClickListener {
            val name = binding.editTextName.text.toString()
            val email = binding.editTextEmail.text.toString()
            val password = binding.editTextPassword.text.toString()

            val updatedUser = User(
                name = name,
                email = email,
                password = password,
            )

            updateUser(userId, updatedUser)
        }
    }

    private fun updateUser(userId: String, user: User) {
        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.updateUser(userId, user)
                if (response.isSuccessful) {
                    val message = response.body()?.get("message") ?: "User updated"
                    Toast.makeText(requireContext(), message.toString(), Toast.LENGTH_SHORT).show()

                    // Optionally update session info
                    sessionManager.saveUserSession(userId, user.name, user.email)

                } else {
                    Toast.makeText(requireContext(), "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
