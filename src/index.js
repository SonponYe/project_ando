// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Remove the static boot splash once React has taken over the page
const bootSplash = document.getElementById("boot-splash");
if (bootSplash) bootSplash.remove();

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    window.dispatchEvent(new CustomEvent("ando-sw-update", { detail: registration }));
  },
});
