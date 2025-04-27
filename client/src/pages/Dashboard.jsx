import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const ticketsRes = await api.get("/tickets");
        const tickets = ticketsRes.data;

        const total = tickets.length;
        const active = tickets.filter((t) => t.status === "Active").length;
        const pending = tickets.filter((t) => t.status === "Pending").length;
        const closed = tickets.filter((t) => t.status === "Closed").length;

        let customers = 0;
        if (user.role === "admin") {
          const usersRes = await api.get("/users?role=customer");
          customers = usersRes.data.length;
        }

        setCounts({ total, active, pending, closed, customers });
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    fetchData();
  }, [user]);

  if (counts === null) {
    return (
      <div className="app">
        <Sidebar />
        <main className="main">
          <h1>Dashboard</h1>
          <p>Loading stats…</p>
        </main>
      </div>
    );
  }

  const metrics = [
    {
      key: "total",
      label: "Total Tickets",
      Icon: FaTicketAlt,
      link: "/tickets",
    },
    {
      key: "active",
      label: "Active",
      Icon: FaCheckCircle,
      link: "/tickets?status=Active",
    },
    {
      key: "pending",
      label: "Pending",
      Icon: FaClock,
      link: "/tickets?status=Pending",
    },
    {
      key: "closed",
      label: "Closed",
      Icon: FaTimesCircle,
      link: "/tickets?status=Closed",
    },
    ...(user.role === "admin"
      ? [
          {
            key: "customers",
            label: "Total Customers",
            Icon: FaUsers,
            link: "/customers",
          },
        ]
      : []),
  ];

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          {metrics.map(({ key, label, Icon, link }) => (
            <div
              key={key}
              className="card stat-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(link)}
            >
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-value">{counts[key]}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
