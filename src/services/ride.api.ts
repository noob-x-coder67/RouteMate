
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const rideService = {
  async getAvailableRides() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/rides`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch rides");
    return response.json();
  },
};

