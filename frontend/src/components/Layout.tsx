import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type LayoutProps = {
  title: string;
  children: ReactNode;
};

const navLinkStyle = (active: boolean) => ({
  color: active ? "#111827" : "#e5e7eb",
  background: active ? "white" : "transparent",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: 700,
});

export default function Layout({ title, children }: LayoutProps) {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("access"));

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0px, #111827 80px, #f3f6fb 80px, #f3f6fb 100%)",
      }}
    >
      <header
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div style={{ color: "white" }}>
          <div style={{ fontWeight: 800, fontSize: "20px" }}>Activity SaaS</div>
          <div style={{ fontSize: "13px", opacity: 0.8 }}>
            PS / MS / GS — préparation d’activités
          </div>
        </div>

        <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {isAuthenticated ? (
            <>
              <Link to="/" style={navLinkStyle(location.pathname === "/")}>
                Dashboard
              </Link>
              <Link
                to="/activities"
                style={navLinkStyle(location.pathname === "/activities")}
              >
                Activities
              </Link>
              <Link
                to="/planning"
                style={navLinkStyle(location.pathname === "/planning")}
              >
                Planning
              </Link>
              <Link
                to="/account"
                style={navLinkStyle(location.pathname === "/account")}
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={navLinkStyle(location.pathname === "/login")}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={navLinkStyle(location.pathname === "/register")}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div className="card" style={{ padding: "28px" }}>
          <h1
            style={{
              marginTop: 0,
              marginBottom: "24px",
              fontSize: "32px",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          {children}
        </div>
      </main>
    </div>
  );
}