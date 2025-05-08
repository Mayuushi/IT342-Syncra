import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
// ... existing code ...

function EditProfile() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    setUser(prev => ({ ...prev, name }));
    // ...save to backend if needed...
  };

  // ...existing code...
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