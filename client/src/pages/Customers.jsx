import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Customers.css";

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user.role === "admin") fetchCustomers();
  }, [user.role]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/users");
      setCustomers(res.data.filter((u) => u.role === "customer"));
    } catch {
      toast.error("Failed to fetch customers");
    }
  };

  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const handleChange = (field) => (e) =>
    setNewUser((p) => ({ ...p, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", newUser);
      toast.success("User created");
      setNewUser({ name: "", email: "", role: "customer", password: "" });
      fetchCustomers();
    } catch {
      toast.error("Error creating user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setCustomers((p) => p.filter((c) => c._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Error deleting");
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditData({ name: c.name, email: c.email });
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/users/${id}`, editData);
      if (res.data.role === "customer") {
        setCustomers((p) => p.map((c) => (c._id === id ? res.data : c)));
      } else {
        setCustomers((p) => p.filter((c) => c._id !== id));
      }
      setEditingId(null);
      toast.success("Updated");
    } catch {
      toast.error("Error updating");
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <ToastContainer position="top-center" autoClose={3000} />
        <h1 className="page-title">User Management</h1>
        <div className="card mb-4 narrow-card">
          <div className="card-header">Add New User</div>
          <form onSubmit={handleCreate} className="customers-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={handleChange("name")}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={handleChange("email")}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={newUser.role} onChange={handleChange("role")}>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={handleChange("password")}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="button-group full-width">
              <button type="submit" className="button primary-button">
                Create User
              </button>
            </div>
          </form>
        </div>

        <div className="customer-list">
          {customers.map((c) => (
            <div key={c._id} className="user-card card mb-2">
              {editingId === c._id ? (
                <>
                  <div className="form-group mb-2">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="user-card-actions">
                    <button
                      className="button primary-button"
                      onClick={() => saveEdit(c._id)}
                    >
                      Save
                    </button>
                    <button
                      className="button secondary-button"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="button danger-button"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="user-card-header">
                    <div>
                      <strong>{c.name}</strong>{" "}
                      <span className="muted-text">({c.role})</span>
                    </div>
                    <div className="user-card-actions">
                      <button
                        className="button primary-button"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="button danger-button"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="user-card-body">{c.email}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
