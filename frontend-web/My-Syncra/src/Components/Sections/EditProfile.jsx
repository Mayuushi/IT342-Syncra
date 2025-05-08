import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

function EditProfile() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    setUser(prev => ({ ...prev, name }));
    // ...save to backend if needed...
  };

  // Remove any state related to password and confirm password if present

  return (
    <form>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        // ...other props...
      />
      <button type="button" onClick={handleSave}>Save</button>
    </form>
  );
}

export { EditProfile }