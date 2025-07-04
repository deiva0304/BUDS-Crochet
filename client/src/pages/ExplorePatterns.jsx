import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ExplorePatterns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const storedSearchTerm = location.state?.searchTerm || "";
  const storedPatterns = location.state?.patterns || [];

  const categories = [
    "Crochet",
    "Beginner",
    "Fall",
    "Summer",
    "Spring",
    "Winter",
    "Patterns",
    "Advanced",
    "Intermediate",
    "Halloween",
    "Christmas",
    "Amigurumi",
    "Valentines",
    "Easter",
  ];

  const fetchPatterns = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch patterns
      const response = await axios.get(
        `https://api.ravelry.com/patterns/search.json`,
        {
          params: { query: searchTerm },
          auth: {
            username: "read-5f7081a2ea4a259480f242bebd04cb38",
            password: "qtVdbDBSTxhZxHf0bSGBe6g8AcTa2v1jXXKC5o/2",
          },
        }
      );

      const fetchedPatterns = response.data.patterns;

      // Fetch pattern sources for additional details
      const patternSourcesResponse = await axios.get(
        `https://api.ravelry.com/pattern_sources/search.json`,
        {
          params: { query: searchTerm },
          auth: {
            username: "read-5f7081a2ea4a259480f242bebd04cb38",
            password: "qtVdbDBSTxhZxHf0bSGBe6g8AcTa2v1jXXKC5o/2",
          },
        }
      );

      const patternSources = patternSourcesResponse.data.pattern_sources;

      // Map sources to patterns based on available data
      const enrichedPatterns = fetchedPatterns.map((pattern) => {
        const source = patternSources.find((src) => src.id === pattern.id);
        return {
          ...pattern,
          difficulty: source ? source.amazon_rating : "Unknown",
          created_at: source ? source.url : pattern.created_at, // Fallback if not found
        };
      });

      setPatterns(enrichedPatterns);
    } catch (error) {
      console.error("Error fetching patterns:", error);
      setError("Failed to fetch patterns. Please try again.");
    }

    setLoading(false);
  };

  const handlePatternClick = (pattern) => {
    navigate(`/pattern/${pattern.id}`, {
      state: { searchTerm, patterns }, // Store search term & results
    });
  };

  useEffect(() => {
    if (storedSearchTerm && storedPatterns.length > 0) {
      setSearchTerm(storedSearchTerm);
      setPatterns(storedPatterns);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="flex mt-28">
       

        {/* Main Content */}
        <div className="flex-1 p-6">

          <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F4AFAB] mb-4">Discover the Joy of Crochet</h1>
          <p className="text-lg text-[#1A202C] max-w-3xl mx-auto">
            Crochet is more than just a hobby—it's a relaxing, creative way to express yourself. Discover thousands of beautiful patterns, whether you're a beginner looking for simple stitches or an expert seeking a challenging design.
          </p>
        </div>

        <div className="flex justify-center my-8">
          <input
            type="text"
            placeholder="Search crochet patterns..."
            className="px-4 py-2 rounded-l-md border w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={fetchPatterns}
            className="bg-blue-400 text-white px-4 rounded-r-md hover:bg-blue-500"
          >
            Search
          </button>
        </div>

          {error && <p className="text-red-500 mt-3">{error}</p>}
          {loading && (
            <p className="mt-4 text-gray-600">Fetching patterns...</p>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-3 gap-6 p-6 mt-6 bg-[url('/bg_img.png')]">
            {patterns.length > 0
              ? patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="p-4 bg-white rounded-lg shadow-md border text-center cursor-pointer"
                    onClick={() => handlePatternClick(pattern)}
                  >
                    {/* Pattern Image */}
                    <img
                      src={
                        pattern.first_photo
                          ? pattern.first_photo.medium_url
                          : "/no_image.png"
                      }
                      alt={pattern.name}
                      className="w-full h-48 object-cover rounded-md"
                    />

                    {/* Pattern Name */}
                    <h3 className="text-lg font-semibold mt-2">
                      {pattern.name}
                    </h3>


                    {/* View on Ravelry Button */}
                    <button
                      key={pattern.id}
                      className="px-4 py-2 mt-10 bg-gray-600 text-white rounded-md"
                      onClick={() => handlePatternClick(pattern)}
                    >
                      View Pattern Details
                    </button>
                  </div>
                ))
              : !loading && <p></p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePatterns;
