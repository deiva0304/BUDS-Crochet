import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AppContent } from "../context/AppContext";

const RowCounter = () => {
  const { patternId } = useParams();
  const { backendUrl } = useContext(AppContent);
  const [patternName, setPatternName] = useState(""); // ✅ Store Pattern Name
  const [currentRow, setCurrentRow] = useState(1);
  const [stitches, setStitches] = useState(0);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success Message State

  useEffect(() => {
    fetchPattern();

    // Add Keyboard Listeners
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchPattern = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/pattern/get-pattern/${patternId}`
      );
      const pattern = response.data.pattern;

      setPatternName(pattern.patternName); // ✅ Set Pattern Name
      setCurrentRow(pattern.currentRow);

      const row = pattern.rowData.find(
        (row) => row.rowNumber === pattern.currentRow
      );
      setStitches(row ? row.stitches : 0);
    } catch (error) {
      console.error("❌ Error fetching pattern:", error);
    }
  };

  const updateRowCounter = async () => {
    await axios.put(`${backendUrl}/api/pattern/update-row/${patternId}`, {
      currentRow,
      stitches,
    });

    // ✅ Show Success Message
    setSuccessMessage(`✅ Saved! Row: ${currentRow}, Stitches: ${stitches}`);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const addNewRow = async () => {
    await axios.put(`${backendUrl}/api/pattern/add-row/${patternId}`);
    setCurrentRow(currentRow + 1);
    setStitches(0);
    fetchPattern();
  };

  const removeLastRow = async () => {
    if (currentRow > 1) {
      await axios.put(`${backendUrl}/api/pattern/remove-row/${patternId}`);
      setCurrentRow(currentRow - 1);
      fetchPattern();
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
      case " ":
        setStitches((prev) => prev + 1); // Add stitch
        break;
      case "ArrowDown":
        setStitches((prev) => Math.max(0, prev - 1)); // Remove stitch
        break;
      case "ArrowRight":
        setCurrentRow((prev) => prev + 1); // Move to next row
        setStitches(0);
        break;
      case "ArrowLeft":
        if (currentRow > 1) {
          setCurrentRow((prev) => prev - 1); // Move to previous row
          fetchPattern();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />

      <div className="p-6 bg-white rounded-lg shadow-md w-96 mt-28 text-center border">
        {/* ✅ Display Pattern Name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{patternName}</h1>
        <h2 className="text-xl font-semibold text-gray-700">Row Counter</h2>

        {/* Success Message Box */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-400">
            {successMessage}
          </div>
        )}

        {/* Display Current Row & Stitches */}
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold">Current Row:</span> {currentRow}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold">Stitches:</span> {stitches}
          </p>
        </div>

        {/* Increment / Decrement Stitches */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-green-500 text-white text-lg rounded-lg shadow-md hover:bg-green-600"
            onClick={() => setStitches(stitches + 1)}
          >
            + Add Stitch
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white text-lg rounded-lg shadow-md hover:bg-red-600"
            onClick={() => setStitches(Math.max(0, stitches - 1))}
          >
            - Remove Stitch
          </button>
        </div>

        {/* Add / Remove Rows */}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-yellow-500 text-white text-lg rounded-lg shadow-md hover:bg-yellow-600"
            onClick={addNewRow}
          >
            + Add Row
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white text-lg rounded-lg shadow-md hover:bg-gray-800"
            onClick={removeLastRow}
          >
            - Remove Last Row
          </button>
        </div>

        {/* Save Progress */}
        <button
          className="w-full mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600"
          onClick={updateRowCounter}
        >
          💾 Save Progress
        </button>
      </div>

      {/* Keyboard Shortcuts Guide */}
<div className="mt-6 p-4 bg-white rounded-lg shadow-md w-80 border ml-10">
  <h3 className="text-lg font-semibold text-gray-800">
    Keyboard Shortcuts
  </h3>
  <div className="border-t border-gray-300 mt-2">
    {[
      "<strong>↑ Up Arrow</strong> / <strong>Spacebar</strong> → Add Stitch",
      "<strong>↓ Down Arrow</strong> → Remove Stitch",
      "<strong>→ Right Arrow</strong> → Next Row",
      "<strong>← Left Arrow</strong> → Previous Row",
    ].map((instruction, index) => (
      <ShortcutRow key={index} value={instruction} />
    ))}
  </div>
</div>
    </div>
  );
};

const ShortcutRow = ({ value }) => (
  <div
    className="py-2 border-b border-gray-200 text-sm text-gray-600"
    dangerouslySetInnerHTML={{ __html: value }}
  />
);

export default RowCounter;
