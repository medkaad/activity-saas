import { api } from "./client";

export const getActivities = async () => {
  const res = await api.get("/activities");
  return res.data;
};

export const generateActivity = async (payload: {
  organization: number;
  level: string;
  domain: string;
  theme: string;
}) => {
  const res = await api.post("/activities/generate", payload);
  return res.data;
};