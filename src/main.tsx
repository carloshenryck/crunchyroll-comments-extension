import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "./components/Popup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
