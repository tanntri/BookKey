import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
// import 'react-tooltip/dist/react-tooltip.css';
import 'react-tabs/style/react-tabs.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
