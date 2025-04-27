import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Tickets() {
  const { user } = useAuth();
  const role = user.role;
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const [filter, setFilter] = useState(params.get("status") || "");
  const [tickets, setTickets] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  const fetchTickets = async () => {
    if (!location.pathname.startsWith("/tickets")) return;
    try {
      const { data } = await api.get("/tickets");
      setTickets(
        data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [location.pathname]);

  useEffect(() => {
    const qs = filter ? `?status=${filter}` : "";
    if (qs !== location.search) navigate(qs, { replace: true });
  }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post("/tickets", { title: newTitle });
      toast.success("Ticket created successfully!");
      setNewTitle("");
      fetchTickets();
    } catch (err) {
      const msg =
        err?.response?.data?.msg || err.message || "Ticket creation failed";
      toast.error(msg);
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setTempStatus(t.status);
  };

  const cancelEdit = () => setEditingId(null);

  const saveStatus = async (id) => {
    try {
      await api.put(`/tickets/${id}`, { status: tempStatus });
      setEditingId(null);
      fetchTickets();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const filtered = tickets.filter((t) => !filter || t.status === filter);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <h1>Tickets</h1>

        {role === "customer" && (
          <form onSubmit={handleCreate} className="card mb-2">
            <div className="form-group">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter ticket title"
                required
              />
            </div>
            <button type="submit" className="button">
              New Ticket
            </button>
          </form>
        )}

        <div className="search-filter mb-4">
          <select
            className="search-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="table-wrapper">
          {filtered.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/tickets/${t._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{t._id.slice(-6)}</td>
                    <td>{t.title}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {editingId === t._id ? (
                        <div className="status-editor">
                          <select
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Closed">Closed</option>
                          </select>
                          <button
                            className="icon-btn save-btn"
                            onClick={() => saveStatus(t._id)}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="icon-btn cancel-btn"
                            onClick={cancelEdit}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="status-readonly">
                          <span className={`badge badge-${t.status}`}>
                            {t.status}
                          </span>
                          {(role === "admin" || role === "agent") && (
                            <button
                              className="icon-btn edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(t);
                              }}
                            >
                              <FaEdit />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td>{t.customer?.name || "-"}</td>
                    <td>{new Date(t.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-placeholder card">
              {filter ? (
                <p>No {filter.toLowerCase()} tickets.</p>
              ) : (
                <p>No tickets have been created yet.</p>
              )}
              {filter && (
                <button className="button mt-2" onClick={() => setFilter("")}>
                  Show All
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
