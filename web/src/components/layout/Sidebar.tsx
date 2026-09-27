/**
 * Sidebar navigation component.
 */
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/surveys", label: "Surveys", icon: "📋" },
  { to: "/detection", label: "Detection", icon: "🔍" },
  { to: "/wave-model", label: "Wave Model", icon: "🌊" },
  { to: "/map", label: "Map View", icon: "🗺️" },
] as const;

export function Sidebar() {
  return (
    <nav className="sidebar-nav">
      <div className="sidebar-brand">
        <h2>🌿 Seagrass</h2>
      </div>
      <ul className="sidebar-links">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
