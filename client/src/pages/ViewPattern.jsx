import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AppContent } from "../context/AppContext";

// Helper component for rendering pattern details with proper alignment
const DetailRow = ({ label, value }) => (
  <div className="flex mt-1 mb-1 border-b border-gray-200 text-gray-600">
    <span className="min-w-[150px] font-medium">{label}:</span>
    <span className="flex-1 font-light">{value}</span>
  </div>
);

const ViewPattern = () => {
  const { patternId } = useParams();
  const [pattern, setPattern] = useState(null);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    fetchPatternDetails();
  }, []);

  const fetchPatternDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/pattern/get-pattern/${patternId}`);
      setPattern(response.data.pattern);
    } catch (error) {
      console.error("❌ Error fetching pattern details:", error);
      setError("Failed to load pattern details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="mt-28 w-4/5 max-w-2xl">
        <h2 className="text-3xl font-semibold mt-8 text-gray-600">Pattern Details</h2>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {pattern ? (
          <div className="p-6 bg-gray-50 rounded-lg shadow-md border mt-6 font-notion">
            {/* Pattern Name */}
            <h3 className="text-lg font-semibold text-gray-600">{pattern.patternName}</h3>

            {/* Pattern Details Section */}
            <div className="border-t border-gray-300 mt-4 space-y-2">
              <DetailRow label="Size" value={pattern.size} />
              <DetailRow label="Yarn" value={pattern.yarn} />
              <DetailRow label="Needle Size" value={pattern.needleSize} />
              <DetailRow label="Gauge" value={pattern.gauge} />
              <DetailRow label="Lot" value={pattern.lot} />
              <DetailRow label="Number of Skeins" value={pattern.numOfSkeins} />
              <DetailRow label="Yardage" value={pattern.yardage} />
              <DetailRow label="Description" value={pattern.description} />
            </div>

            {/* Display Visualization */}
            {pattern.imageBase64 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-600">Visualization</h3>
                <img
                  src={`data:image/png;base64,${pattern.imageBase64}`}
                  alt="Pattern Visualization"
                  className="w-full h-auto rounded-md border mt-2"
                />
              </div>
            )}

            {/* Display Generated Instructions */}
            {pattern.instructions && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-600">Generated Instructions</h3>
                <pre className="bg-gray-200 p-4 rounded-md text-sm overflow-auto border mt-2">
                  {pattern.instructions}
                </pre>
              </div>
            )}

            {/* Notes Section */}
            {pattern.notes_html && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                <div className="border-t border-gray-300">
                  {pattern.notes_html
                    .split(/\n+/) // Split notes by multiple new lines
                    .map((note) => note.trim()) // Trim spaces
                    .filter((note) => note.length > 1 && note !== "•") // Remove empty lines and dots
                    .map((note, index) => (
                      <NoteRow key={index} value={note} />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">Loading pattern details...</p>
        )}
      </div>
    </div>
  );
};

export default ViewPattern;
