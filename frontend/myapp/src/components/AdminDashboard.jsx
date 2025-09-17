import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); // redirect to login if not logged in
      return;
    }

    fetch(`${API_URL}/api/users/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
  if (Array.isArray(data)) {
    setUsers(data);
  } else {
    toast.error(data.msg || "Unexpected response");
    setUsers([]);
  }
  setLoading(false);
})

      .catch(() => {
        toast.error("Failed to fetch users");
        setLoading(false);
      });
  }, [token, navigate, API_URL]);

  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user and their notes?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted");
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        toast.error(data.msg || "Failed to delete user");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Error deleting user");
    }
  }

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-3 py-2">Username</th>
              <th className="border border-gray-300 px-3 py-2">Email</th>
              <th className="border border-gray-300 px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{user.username || "N/A"}</td>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
