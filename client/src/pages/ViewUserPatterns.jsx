import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const ViewUserPatterns = () => {
  const [patterns, setPatterns] = useState([]);
  const [error, setError] = useState("");
  const { userData, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPatterns();
  }, []);

  const fetchUserPatterns = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/pattern/get-patterns/${userData.email}`
      );
      setPatterns(response.data.patterns);
    } catch (error) {
      console.error("❌ Error fetching user patterns:", error);
      setError("Failed to load patterns.");
    }
  };

  const deletePattern = async (patternId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pattern? This action cannot be undone.");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/pattern/delete-pattern/${patternId}`);
      
      // ✅ Remove pattern from UI instantly
      setPatterns(patterns.filter(pattern => pattern._id !== patternId));
    } catch (error) {
      console.error("❌ Error deleting pattern:", error);
      setError("Failed to delete pattern.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
  
      {/* Section: Title */}
      <div className="mt-28">
        <h2 className="text-2xl font-semibold text-gray-500">Your Patterns</h2>
      </div>
  
      {/* Section: Patterns Grid */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {error && <p className="text-red-400 mt-2">{error}</p>}
  
        {patterns.length > 0 ? (
          patterns.map((pattern) => (
            <div
              key={pattern._id}
              className="p-4 bg-white rounded-lg shadow-md border text-center w-full"
            >
              <h3 className="text-lg font-medium text-gray-500">{pattern.patternName}</h3>
  
              {/* View Button */}
              <button
                className="mt-3 px-4 py-2 bg-blue-400 text-white rounded-md w-full"
                onClick={() => navigate(`/view-pattern/${pattern._id}`)}
              >
                View
              </button>
  
              {/* Row Counter Button */}
              <button
                className="mt-3 px-4 py-2 bg-green-400 text-white rounded-md w-full"
                onClick={() => navigate(`/row-counter/${pattern._id}`)}
              >
                Row Counter
              </button>
  
              {/* Delete Button */}
              <button
                className="mt-3 px-4 py-2 bg-red-400 text-white rounded-md w-full"
                onClick={() => deletePattern(pattern._id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No patterns found.</p>
        )}
      </div>
  
      {/* Section: New Pattern Button */}
      <div className="mt-6">
        <button
          className="px-8 py-3 bg-[#1A202C] text-white rounded-lg text-lg"
          onClick={() => navigate(`/new-pattern`)}
        >
          + New Pattern
        </button>
      </div>
    </div>
  );
  
};

export default ViewUserPatterns;
