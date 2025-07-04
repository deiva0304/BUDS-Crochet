import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";


const Pattern = () => {
  const { id } = useParams();
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
const location = useLocation(); // Get stored search data
const { searchTerm, patterns } = location.state || {}; // Retrieve search data

const handleBackClick = () => {
    navigate("/explore-patterns", { state: { searchTerm, patterns } }); // Restore state
  };



  useEffect(() => {
    const fetchPatternDetails = async () => {
      try {
        const response = await axios.get(`https://api.ravelry.com/patterns/${id}.json`, {
          auth: {
            username: "read-5f7081a2ea4a259480f242bebd04cb38",
            password: "qtVdbDBSTxhZxHf0bSGBe6g8AcTa2v1jXXKC5o/2",
          },
        });

        console.log("Pattern Data:", response.data.pattern);
        setPattern(response.data.pattern);
      } catch (err) {
        console.error("Error fetching pattern details:", err);
        setError("Failed to load pattern details.");
      }
      setLoading(false);
    };

    fetchPatternDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading pattern details...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />

      <div className="min-h-screen p-6 mt-28 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">{pattern.name} ({pattern.craft?.name || "Crochet"})</h1>
          <p className="text-gray-500 text-sm mt-2">Pattern ID: {pattern.id}</p>
          <p className="text-2xl font-semibold mt-3">
            {pattern.free ? "Free" : `$${pattern.price || "0.00"}`}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-10 mt-6">
          {/* Image Section */}
          <div className="flex flex-col items-center w-full md:w-1/2">
            {pattern.photos && pattern.photos.length > 0 ? (
              <img
                src={pattern.photos[0].medium_url}
                alt={pattern.name}
                className="w-full md:w-3/4 rounded-lg shadow-md"
              />
            ) : (
              <p className="text-center text-gray-500">No image available</p>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pattern Details</h2>
            <div className="border-t border-gray-300">
              <DetailRow label="Pattern Designer" value={pattern.designer?.name || "Unknown"} />
              <DetailRow label="Skill Level" value={pattern.difficulty_average ? pattern.difficulty_average.toFixed(1) + " ⭐" : "Not Rated"} />
              <DetailRow label="Project Type" value={pattern.pattern_type?.name || "Not specified"} />
              <DetailRow label="Yarn Used" value={pattern.yarn_weight_description || "Not specified"} />
              <DetailRow label="Pattern Gauge" value={pattern.gauge_description || "Not specified"} />
              <DetailRow label="Pattern Size Options" value={pattern.sizes_available || "Not specified"} />
              <DetailRow label="Pattern Yarn Weight" value={pattern.yarn_weight?.name || "Not specified"} />
              <DetailRow label="Fiber" value={pattern.yarn_weight?.fiber_type || "Not specified"} />
              <DetailRow label="Dimensions Detail" value={pattern.dimensions_description || "Not specified"} />
              <DetailRow label="Pattern Craft" value={pattern.craft?.name || "Not specified"} />
              <DetailRow label="Made For" value="Home" />
            </div>
          </div>
        </div>

        {/* Notes Section with Proper HTML Rendering */}
        {pattern.notes_html && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
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

        {/* View on Ravelry Button */}
        <div className="text-center mt-6">
          <a
            href={pattern.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-md"
          >
            🔗 View on Ravelry
          </a>
          <br></br>
          <button
  onClick={handleBackClick}
  className="px-4 py-2 bg-gray-600 text-white rounded-md mt-4"
>
  ⬅ Back to Explore Patterns
</button>
        </div>


      </div>
    </div>
  );
};

// Helper component for details row
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <span className="text-gray-700 font-semibold">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

// Helper component for notes row with proper HTML rendering
const NoteRow = ({ value }) => (
  <div className="py-2 border-b border-gray-200 text-gray-800" dangerouslySetInnerHTML={{ __html: value }} />
);

export default Pattern;
