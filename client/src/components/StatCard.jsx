import React from "react";
import { Link } from "react-router-dom";

export default function StatCard({
  label,
  value,
  Icon,
  colorClass = "",
  linkTo,
}) {
  const inner = (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-icon-wrapper">
        <Icon className="stat-icon" />
      </div>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return linkTo ? (
    <Link to={linkTo} className="stat-card-link">
      {inner}
    </Link>
  ) : (
    inner
  );
}
