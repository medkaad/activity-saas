import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateActivity, getActivities } from "../api/activities";
import { getOrganizations } from "../api/organizations";
import Layout from "../components/Layout";

type Activity = {
  id: number;
  title: string;
  level: string;
  domain: string;
  duration_minutes: number;
  materials: string[] | string;
  description: string;
};

type Organization = {
  id: number;
  name: string;
  owner_email: string;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organization, setOrganization] = useState("");
  const [level, setLevel] = useState("PS");
  const [domain, setDomain] = useState("LANGAGE");
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data);

      if (data.length > 0) {
        setOrganization(String(data[0].id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadActivities();
    loadOrganizations();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const newActivity = await generateActivity({
        organization: Number(organization),
        level,
        domain,
        theme,
      });

      setActivities((prev) => [newActivity, ...prev]);
      setTheme("");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.error || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Activities">
      <h2 style={{ marginBottom: "16px" }}>Generate AI Activity</h2>

      <div style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
        <select
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="PS">PS</option>
          <option value="MS">MS</option>
          <option value="GS">GS</option>
        </select>

        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="LANGAGE">LANGAGE</option>
          <option value="MOTRICITE">MOTRICITE</option>
          <option value="MATHS">MATHS</option>
          <option value="ART">ART</option>
          <option value="EXPLORER">EXPLORER</option>
          <option value="VIVRE">VIVRE</option>
        </select>

        <input
          type="text"
          placeholder="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      <hr style={{ margin: "32px 0" }} />

      <h2>Existing Activities</h2>

      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {activities.map((activity) => (
            <Link
              to={`/activities/${activity.id}`}
              key={activity.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "18px",
                  background: "#f9fafb",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "18px" }}>
                  {activity.title}
                </div>

                <div style={{ color: "#6b7280", marginTop: "6px" }}>
                  {activity.level} — {activity.domain}
                </div>

                <div style={{ marginTop: "6px" }}>
                  <b>Duration:</b> {activity.duration_minutes} min
                </div>

                <div style={{ marginTop: "10px" }}>
                  <b>Materials:</b>
                  <div style={{ marginTop: "4px", color: "#374151" }}>
                    {Array.isArray(activity.materials)
                      ? activity.materials.join(", ")
                      : activity.materials}
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <b>Description:</b>
                  <div style={{ marginTop: "4px", color: "#374151" }}>
                    {activity.description}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}