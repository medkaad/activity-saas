import { api } from "./client";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await api.post("/auth/register", {
    email,
    password,
  });

  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};