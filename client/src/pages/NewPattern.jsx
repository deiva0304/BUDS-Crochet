import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const NewPattern = () => {
  const [isNewPattern, setIsNewPattern] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(""); 
  const { userData, backendUrl } = useContext(AppContent);

  const [patternDetails, setPatternDetails] = useState({
    patternName: "",
    size: "",
    yarn: "",
    needleSize: "",
    gauge: "",
    lot: "",
    numOfSkeins: "",
    yardage: "",
    description: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    setPatternDetails({ ...patternDetails, [e.target.name]: e.target.value });
  };

  // Function to validate pattern details
  const validatePatternDetails = () => {
    for (const key in patternDetails) {
      if (!patternDetails[key].trim()) {
        setError(`❌ ${key.replace(/([A-Z])/g, " $1")} is required.`);
        return false;
      }
    }
    setError("");
    return true;
  };

  // Function to save pattern details
  const savePatternDetails = async (redirectPath) => {
    if (!validatePatternDetails()) return;

    try {
      const userEmail = userData.email;
      if (!userEmail) {
        setError("❌ User not logged in.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/pattern/save-pattern`,
        { ...patternDetails },
        { withCredentials: true }
      );

      if (response.data.patternId) {
        navigate(`/${redirectPath}/${response.data.patternId}`);
      } else {
        setError("❌ Failed to save pattern details.");
      }
    } catch (error) {
      console.error("❌ Error saving pattern details:", error);
      setError("❌ Failed to save pattern details. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center pt-20">
      <Navbar />

      {/* Initial state before creating a pattern */}
      {!isNewPattern ? (
        <div className="flex flex-col items-center justify-center w-full max-w-lg p-8 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-400 mt-20 h-[80vh] overflow-y-auto">
          <img src={assets.cat} alt="Cat with yarn" className="w-45 h-52 mb-4 rounded-3xl" />
          <p className="text-gray-500 text-center mb-4 p-4">Get started by creating a new pattern.</p>
          <button className="px-8 py-3 bg-[#1A202C] text-white rounded-lg text-lg" onClick={() => setIsNewPattern(true)}>
            + New Pattern
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-4/5 max-w-4xl p-8 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-400">
          {/* Form Section */}
          <div>
            <p className="text-gray-500 text-center mb-4 p-4">Fill in the details to create a new pattern.</p>
            {error && <p className="text-red-500">{error}</p>}

            {Object.keys(patternDetails).map((key) => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                className="w-full p-2 border rounded-md mb-2"
                onChange={handleInputChange}
              />
            ))}

            <button className="px-8 py-3 bg-[#1A202C] text-white rounded-lg text-lg mt-4" onClick={() => savePatternDetails("row-counter")}>
              Save & Track Row Counter
            </button>
            <button className="px-8 py-3 bg-[#1A202C] text-white rounded-lg text-lg mt-4" onClick={() => savePatternDetails("pattern-visualize")}>
              Save & Visualize
            </button>
          </div>

          {/* Explanation Section */}
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Pattern Field Guide</h2>
            <div className="border-t border-gray-300 space-y-2">
              <DetailRow label="Pattern Name" value="The name or title of the crochet pattern." />
              <DetailRow label="Size" value="The dimensions or final measurements of the finished crochet item." />
              <DetailRow label="Yarn" value="The type of yarn used (e.g., cotton, acrylic, wool)." />
              <DetailRow label="Needle Size" value="The crochet hook size recommended for the pattern." />
              <DetailRow label="Gauge" value="The number of stitches and rows per inch, ensuring the right fit." />
              <DetailRow label="Lot" value="The dye lot of the yarn, ensuring consistent color throughout." />
              <DetailRow label="Num Of Skeins" value="The number of yarn skeins or balls needed to complete the pattern." />
              <DetailRow label="Yardage" value="The total length of yarn required for the project." />
              <DetailRow label="Description" value="A brief overview of the pattern, including style and difficulty." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for structured explanations
const DetailRow = ({ label, value }) => (
  <div className="flex py-2 border-b border-gray-200 text-gray-600">
    <span className="min-w-[150px] font-semibold">{label}:</span>
    <span className="flex-1">{value}</span>
  </div>
);

export default NewPattern;
