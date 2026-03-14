import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { getOrganizations } from "../api/organizations";
import Layout from "../components/Layout";

type User = {
  id: number;
  email: string;
};

type Organization = {
  id: number;
  name: string;
  owner_email: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUser();
    loadOrganizations();
  }, []);

  return (
    <Layout title="My Account">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">User Info</h2>

          {user ? (
            <div className="page-grid">
              <div>
                <b>User ID</b>
                <div className="muted">{user.id}</div>
              </div>

              <div>
                <b>Email</b>
                <div className="muted">{user.email}</div>
              </div>
            </div>
          ) : (
            <p>Loading user...</p>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Organizations</h2>

          {organizations.length === 0 ? (
            <p className="muted">No organization found.</p>
          ) : (
            <div className="page-grid">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                    background: "#f9fafb",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{org.name}</div>
                  <div className="muted">
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