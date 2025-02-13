import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const PatternVisualize = () => {
  const [stitchType, setStitchType] = useState("Chain");
  const [amount, setAmount] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [stitchCount, setStitchCount] = useState(0);
  const [stitchOptions, setStitchOptions] = useState(["Chain"]);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternText, setPatternText] = useState("");

  // Fetch row and stitch counts on component mount
  useEffect(() => {
    fetchCounts();
  }, []);

  // Fetch row & stitch counts
  const fetchCounts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_counts");
      setRowCount(response.data.row_count);
      setStitchCount(response.data.stitch_count);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Add Stitch
  const addStitch = async () => {
    try {
      const response = await axios.post("http://localhost:8000/add_stitch", {
        stitch_type: stitchType,
        amount: amount,
      });
      console.log(response.data.message);
      fetchCounts();
    } catch (error) {
      console.error("Error adding stitch:", error);
    }
  };

  // Add New Row
  const addNewRow = async () => {
    try {
      const response = await axios.post("http://localhost:8000/new_row");
      setStitchOptions(response.data.stitch_options);
      fetchCounts();
    } catch (error) {
      console.error("Error adding new row:", error);
    }
  };

  // Undo Action
  const undoAction = async () => {
    try {
      const response = await axios.post("http://localhost:8000/undo");
      setRowCount(response.data.row_count);
      setStitchCount(response.data.stitch_count);
      setStitchOptions(response.data.stitch_options);
      fetchCounts();
    } catch (error) {
      console.error("Error undoing action:", error);
    }
  };

  // Redo Action
  const redoAction = async () => {
    try {
      const response = await axios.post("http://localhost:8000/redo");
      setRowCount(response.data.row_count);
      setStitchCount(response.data.stitch_count);
      setStitchOptions(response.data.stitch_options);
      fetchCounts();
    } catch (error) {
      console.error("Error redoing action:", error);
    }
  };

  // Clear Pattern
  const clearPattern = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear the pattern? This cannot be undone."
    );
    if (!confirmClear) return;

    try {
      const response = await axios.post("http://localhost:8000/clear_pattern");
      setRowCount(response.data.row_count);
      setStitchCount(response.data.stitch_count);
      setStitchOptions(response.data.stitch_options);
      fetchCounts();
    } catch (error) {
      console.error("Error clearing pattern:", error);
    }
  };

  // Render Crochet Pattern
  const renderPattern = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/render_pattern", {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error("Error rendering pattern:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Written Pattern
  const generatePattern = async () => {
    try {
      const response = await axios.get("http://localhost:8000/generate_written_pattern");
      setPatternText(response.data.written_pattern);
    } catch (error) {
      console.error("Error generating pattern:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="flex w-full max-w-6xl mx-auto min-h-screen p-4 mt-20">
        {/* Left Panel */}
        <div className="w-1/3 p-4 bg-white">
          <h2 className="mt-4 text-lg font-semibold">Create your own pattern!</h2>

          {/* Controls */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Crochet Stitch Type:</label>
            <select
              className="w-full p-2 mt-1 border rounded-md"
              value={stitchType}
              onChange={(e) => setStitchType(e.target.value)}
            >
              {stitchOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className="block mt-3 text-sm font-medium">Amount of Stitches to be added:</label>
            <input
              type="number"
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />

            <button
              className="w-full mt-4 p-3 bg-[#F4AFAB] text-white rounded-md text-lg"
              onClick={addStitch}
            >
              Add Stitch
            </button>
          </div>

          {/* Other Controls */}
          <button className="w-full mt-3 p-3 bg-[#F4AFAB] text-white rounded-md" onClick={addNewRow}>
            Create New Row
          </button>

          <div className="flex justify-between mt-3">
            <button className="w-1/2 p-3 bg-[#F4AFAB] text-white rounded-md" onClick={undoAction}>
              Undo
            </button>
            <button className="w-1/2 ml-2 p-3 bg-[#F4AFAB] text-white rounded-md" onClick={redoAction}>
              Redo
            </button>
          </div>

          <div className="flex justify-between mt-3">
            <button className="w-1/2 p-3 border rounded-md">Back</button>
            <button className="w-1/2 ml-2 p-3 bg-gray-300 text-gray-500 rounded-md" onClick={clearPattern}>
              Clear
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 p-6 bg-[#F4CBC6] rounded-lg">
          {/* Output Preview */}
          <div className="h-64 bg-white rounded-md flex items-center justify-center">
            {loading ? (
              <p>Rendering...</p>
            ) : imageSrc ? (
              <img src={imageSrc} alt="Pattern Preview" className="h-full w-auto rounded-md" />
            ) : (
              <p>No visualization yet</p>
            )}
          </div>

          {/* Details Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <p>Row Count: {rowCount}</p>
            <p>Stitch Count: {stitchCount}</p>

            <button className="w-full mt-4 p-3 bg-white text-black rounded-md text-lg" onClick={renderPattern}>
              Create
            </button>
          </div>

          {/* Written Pattern */}
          <div className="mt-4 p-4 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Generated Pattern</h3>
            <pre>{patternText}</pre>
            <button className="w-full mt-2 p-3 bg-[#F4AFAB] text-white rounded-md" onClick={generatePattern}>
              Generate Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternVisualize;
