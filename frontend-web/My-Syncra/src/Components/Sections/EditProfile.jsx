import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

function EditProfile() {
  const { user, setUser } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [confirmEmail, setConfirmEmail] = useState(user.email || "");

  const handleSave = (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      setUser({
        ...user,
        firstName,
        lastName,
        email, // Save email even if empty
      });
    }
    // Optionally, show a message if first/last name is missing
  };

  return (
    <form onSubmit={handleSave}>
      <input
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email Address"
        // required removed
      />
      <input
        type="email"
        value={confirmEmail}
        onChange={e => setConfirmEmail(e.target.value)}
        placeholder="Confirm Email Address"
        // required removed
      />
      <button type="submit">Save Info</button>
    </form>
  );
}

export default EditProfile;