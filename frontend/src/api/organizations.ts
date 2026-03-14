import { api } from "./client";

export const getOrganizations = async () => {
  const res = await api.get("/orgs");
  return res.data;
};