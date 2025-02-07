import React, { createContext, useState, useEffect } from "react";

export const PricesContext = createContext();

export const PricesProvider = ({ children }) => {

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  let ws = null;
  let reconnectAttempts = 0;
  let response;

  const fetchInitialData = async () => {
    try {
      console.log("📡 Fetching initial prices...");
      
      if (process.env.NODE_ENV === "development") {
        response = await fetch("http://localhost:5001/api/prices");
      } else {
        response = await fetch("https://faustus-price-checker.onrender.com/api/prices");
      }
      
      if (!response.ok) throw new Error("Failed to fetch prices");
      const data = await response.json();
      setPrices(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching prices:", error);
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (process.env.NODE_ENV === "development") {
      ws = new WebSocket("ws://localhost:5001");
    } else {
      ws = new WebSocket("wss://faustus-price-checker.onrender.com");
    }

    ws.onopen = () => {
      console.log("✅ WebSocket connected!");
      setIsConnected(true);
      reconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      console.log("📡 Received WebSocket update:", event.data);
      setPrices(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected.");
      setIsConnected(false);

      // Auto-reconnect with exponential backoff (max 30s)
      if (reconnectAttempts < 10) {
        const timeout = Math.min(5000 * 2 ** reconnectAttempts, 30000);
        console.log(`🔄 Reconnecting WebSocket in ${timeout / 1000} seconds...`);
        reconnectAttempts++;
        setTimeout(connectWebSocket, timeout);
      } else {
        console.error("🚨 Max WebSocket reconnect attempts reached.");
      }
    };
  };

  useEffect(() => {
    fetchInitialData();
    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, []);

  return (
    <PricesContext.Provider value={{ prices, loading, isConnected }}>
      {children}
    </PricesContext.Provider>
  );
};
