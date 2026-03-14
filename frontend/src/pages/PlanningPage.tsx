import { useEffect, useState } from "react";
import { getActivities } from "../api/activities";
import { getOrganizations } from "../api/organizations";
import {
  createWeeklyPlan,
  createWeeklyPlanItem,
  getWeeklyPlans,
} from "../api/planning";
import Layout from "../components/Layout";

type Organization = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  title: string;
};

type WeeklyPlanItem = {
  id: number;
  activity: number;
  activity_title: string;
  day: string;
  position: number;
};

type WeeklyPlan = {
  id: number;
  organization: number;
  week_start: string;
  items: WeeklyPlanItem[];
};

export default function PlanningPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);

  const [organization, setOrganization] = useState("");
  const [weekStart, setWeekStart] = useState("2026-03-16");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [day, setDay] = useState("MON");
  const [position, setPosition] = useState("1");

  const loadPlans = async () => {
    try {
      const data = await getWeeklyPlans();
      setPlans(data);

      if (data.length > 0 && !selectedPlan) {
        setSelectedPlan(String(data[0].id));
      }
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

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);

      if (data.length > 0) {
        setSelectedActivity(String(data[0].id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPlans();
    loadOrganizations();
    loadActivities();
  }, []);

  const handleCreatePlan = async () => {
    try {
      const newPlan = await createWeeklyPlan({
        organization: Number(organization),
        week_start: weekStart,
      });

      setPlans((prev) => [newPlan, ...prev]);
      setSelectedPlan(String(newPlan.id));
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to create weekly plan");
    }
  };

  const handleAddItem = async () => {
    try {
      await createWeeklyPlanItem({
        weekly_plan: Number(selectedPlan),
        activity: Number(selectedActivity),
        day,
        position: Number(position),
      });

      await loadPlans();
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to add activity");
    }
  };

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  return (
    <Layout title="Weekly Planning">
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Create Weekly Plan</h2>

          <div className="page-grid">
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

            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
            />

            <button onClick={handleCreatePlan}>Create Plan</button>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Add Activity</h2>

          <div className="page-grid">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  Week {plan.week_start}
                </option>
              ))}
            </select>

            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>

            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="MON">Monday</option>
              <option value="TUE">Tuesday</option>
              <option value="WED">Wednesday</option>
              <option value="THU">Thursday</option>
              <option value="FRI">Friday</option>
            </select>

            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
            />

            <button onClick={handleAddItem}>Add to Plan</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2 className="card-title">Weekly Plans</h2>

        {plans.length === 0 ? (
          <p className="muted">No plans yet.</p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="card" style={{ marginBottom: "20px" }}>
              <h3>Week of {plan.week_start}</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                {days.map((d) => {
                  const items = plan.items
                    .filter((i) => i.day === d)
                    .sort((a, b) => a.position - b.position);

                  return (
                    <div
                      key={d}
                      style={{
                        background: "#f9fafb",
                        borderRadius: "12px",
                        padding: "12px",
                        border: "1px solid #e5e7eb",
                        minHeight: "120px",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: "10px" }}>
                        {d}
                      </div>

                      {items.length === 0 ? (
                        <div className="muted">Empty</div>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              background: "#eff6ff",
                              borderRadius: "8px",
                              padding: "8px",
                              marginBottom: "6px",
                              fontSize: "14px",
                            }}
                          >
                            {item.activity_title}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}