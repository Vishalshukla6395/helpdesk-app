import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h1>Helpdesk</h1>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tickets">Tickets</NavLink>
        {user.role === "admin" && <NavLink to="/customers">Customers</NavLink>}
      </nav>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
