import "./storage-shim";
import React from "react";
import ReactDOM from "react-dom/client";
import SupplierScout from "./SupplierScout";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SupplierScout />
  </React.StrictMode>
);
