import { useState } from "react";
import { login, register } from "../api/auth";
import { createOrganization } from "../api/organizations";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await register(email, password);
      await login(email, password);

      if (schoolName.trim()) {
        await createOrganization(schoolName);
      }

      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #60a5fa 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.98)",
          borderRadius: "22px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            Register
          </div>
          <div className="muted">
            Créez votre compte et votre école
          </div>
        </div>

        <div className="page-grid">
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              School name
            </label>
            <input
              type="text"
              placeholder="École Maternelle Demo"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Création..." : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}