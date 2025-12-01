import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/delivery/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setOrders([]);
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/delivery/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <DeliveryContext.Provider value={{ token, user, orders, login, logout, fetchOrders }}>
      {children}
    </DeliveryContext.Provider>
  );
};
