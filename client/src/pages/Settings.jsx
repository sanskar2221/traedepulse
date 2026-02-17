import { useEffect, useState } from "react";
import api from "../services/api";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/update-profile", { name, email });
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading settings...</div>;
  if (!user) return <div>Unable to load profile</div>;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-semibold">Settings</h1>

      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={updateProfile} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={changePassword}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>

      {/* Account */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p>
          Joined:{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "-"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Settings;
