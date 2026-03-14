import { useEffect, useState } from "react";
import { getOrganizations } from "../api/organizations";
import Layout from "../components/Layout";

type Organization = {
  id: number;
  name: string;
  owner_email: string;
};

export default function DashboardPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrganizations();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="page-grid">
        <div className="grid-3">
          <div className="card">
            <div className="muted" style={{ marginBottom: "8px" }}>
              Organizations
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800 }}>
              {organizations.length}
            </div>
          </div>

          <div className="card">
            <div className="muted" style={{ marginBottom: "8px" }}>
              Levels
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800 }}>PS / MS / GS</div>
          </div>

          <div className="card">
            <div className="muted" style={{ marginBottom: "8px" }}>
              Status
            </div>
            <div style={{ fontSize: "34px", fontWeight: 800, color: "#059669" }}>
              Active
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Organizations</h2>

          {organizations.length === 0 ? (
            <p className="muted">No organizations found.</p>
          ) : (
            <div className="page-grid">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "16px",
                    background: "#f9fafb",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "18px" }}>
                    {org.name}
                  </div>
                  <div className="muted" style={{ marginTop: "6px" }}>
                    Owner: {org.owner_email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}