import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { downloadActivityPdf, getActivityById } from "../api/activities";

type Activity = {
  id: number;
  title: string;
  level: string;
  domain: string;
  duration_minutes: number;
  materials: string[] | string;
  description: string;
};

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const loadActivity = async () => {
    try {
      const data = await getActivityById(Number(id));
      setActivity(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setLoadingPdf(true);

      const blob = await downloadActivityPdf(Number(id));
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `activity_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("PDF export failed");
    } finally {
      setLoadingPdf(false);
    }
  };

  if (!activity) {
    return (
      <Layout title="Activity">
        <p>Loading activity...</p>
      </Layout>
    );
  }

  return (
    <Layout title={activity.title}>
      <div style={{ display: "grid", gap: "16px" }}>
        <div>
          <b>Level:</b> {activity.level}
        </div>

        <div>
          <b>Domain:</b> {activity.domain}
        </div>

        <div>
          <b>Duration:</b> {activity.duration_minutes} minutes
        </div>

        <div>
          <b>Materials:</b>
          <div style={{ marginTop: "6px" }}>
            {Array.isArray(activity.materials)
              ? activity.materials.join(", ")
              : activity.materials}
          </div>
        </div>

        <div>
          <b>Description:</b>
          <div style={{ marginTop: "6px" }}>{activity.description}</div>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={loadingPdf}
          style={{
            marginTop: "20px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#111827",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loadingPdf ? "Exporting..." : "Export PDF"}
        </button>
      </div>
    </Layout>
  );
}