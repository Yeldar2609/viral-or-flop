import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import { App } from "./App";
import "./styles.css";

if (import.meta.env.DEV && import.meta.env["VITE_DEV_TOOLS"] === "1") {
  void import("react-grab");
  void import("react-scan");
}
const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
