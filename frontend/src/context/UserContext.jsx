// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import  {API}  from "../api/apiInstance";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/user/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
