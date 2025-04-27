import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TicketDetail() {
  const params = useParams();
  const ticketId = params.ticketId || params.id;
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchTicket() {
      setLoading(true);
      try {
        const { data } = await api.get(`/tickets/${ticketId}`);
        setTicket(data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
        toast.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    }
    if (ticketId) fetchTicket();
  }, [ticketId]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.warn("Please add text or attach a file.");
      return;
    }

    const form = new FormData();
    form.append("text", text);
    if (file) form.append("attachment", file);

    try {
      await api.post(`/tickets/${ticketId}/notes`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data } = await api.get(`/tickets/${ticketId}`);
      setTicket(data);
      setText("");
      setFile(null);
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      const msg =
        error?.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <main className="main">
          <p>Loading ticket…</p>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="app">
        <Sidebar />
        <main className="main">
          <p>Ticket not found.</p>
          <button onClick={() => navigate(-1)} className="button mt-2">
            ← Back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <ToastContainer position="top-center" autoClose={3000} />

        <button onClick={() => navigate(-1)} className="button mb-2">
          ← Back
        </button>
        <h1>{ticket.title}</h1>
        <p>Status: {ticket.status}</p>

        <div className="space-y-2 mb-6">
          {(ticket.notes || []).map((n) => (
            <div key={n._id} className="card">
              <p className="font-semibold">
                {n.author?.name || "Unknown"}{" "}
                <span className="text-sm">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </p>
              <p>{n.text}</p>
              {n.attachment && (
                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${
                    n.attachment
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download: {n.attachment}
                </a>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={addNote} className="space-y-3">
          <div className="form-group">
            <textarea
              className="input-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a note"
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
          <button type="submit" className="button">
            Add Note
          </button>
        </form>
      </main>
    </div>
  );
}
