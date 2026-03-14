import { api } from "./client";

export const getWeeklyPlans = async () => {
  const res = await api.get("/weekly-plans");
  return res.data;
};

export const createWeeklyPlan = async (payload: {
  organization: number;
  week_start: string;
}) => {
  const res = await api.post("/weekly-plans", payload);
  return res.data;
};

export const createWeeklyPlanItem = async (payload: {
  weekly_plan: number;
  activity: number;
  day: string;
  position: number;
}) => {
  const res = await api.post("/weekly-plan-items", payload);
  return res.data;
};