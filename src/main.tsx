import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontWeight: "500",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "500px",
          },
          // Configuración específica por tipo de toast
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "#3b82f6",
              color: "#ffffff",
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>
);
