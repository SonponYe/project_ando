// src/pages/ErrorPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-600">
      <h1 className="text-3xl font-bold mb-4">Something went wrong 😕</h1>
      <p className="mb-4">Could not authenticate or load the app properly.</p>
      <button
        onClick={() => navigate("/auth")}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
