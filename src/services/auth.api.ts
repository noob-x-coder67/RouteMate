const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const authService = {
  // Login Existing User
  async login(credentials: any) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Invalid credentials");
    return response.json();
  },

  // Register New User
  async register(userData: any) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  // Update Profile Logic
  async updateProfile(profileData: any) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Update failed");
    return data;
  },

  // University Request Logic (Fixes the syntax error on line 61)
  async requestUniversity(data: { email: string; universityName: string }) {
    const response = await fetch(`${API_URL}/universities/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to submit request");
    return response.ok;
  },
};
