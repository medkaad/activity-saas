import { api } from "./client";

export const getOrganizations = async () => {
  const res = await api.get("/orgs");
  return res.data;
};

export const createOrganization = async (name: string) => {
  const res = await api.post("/orgs", { name });
  return res.data;
};