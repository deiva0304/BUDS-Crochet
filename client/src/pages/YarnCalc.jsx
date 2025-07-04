import React, { useState } from "react";
import Navbar from "../components/Navbar";

const YarnCalc = () => {
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [finishedWeight, setFinishedWeight] = useState("");
  const [yardage, setYardage] = useState(null);

  const calculateYardage = () => {
    if (weight && length && finishedWeight) {
      const totalYardage = (finishedWeight / weight) * length;
      setYardage(totalYardage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center pt-20">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-4/5 max-w-4xl p-8 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-400">
        {/* Input Form Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">Yarn Calculator</h1>

          <InputField label="Weight of Yarn (grams)" value={weight} setValue={setWeight} />
          <InputField label="Total Length of Skein (yards)" value={length} setValue={setLength} />
          <InputField label="Weight of Finished Project (grams)" value={finishedWeight} setValue={setFinishedWeight} />

          <button className="w-full p-3 bg-[#F4AFAB] text-white rounded-lg mt-4" onClick={calculateYardage}>
            Calculate Yardage
          </button>

          {yardage !== null && (
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold">Estimated Yardage: {yardage.toFixed(2)} yards</h2>
            </div>
          )}
        </div>

        {/* Explanation Section */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Guide</h2>
          <div className="border-t border-gray-300 space-y-2">
            <DetailRow label="Weight of Yarn" value="The total weight of the yarn skein in grams." />
            <DetailRow label="Total Length of Skein" value="The length of yarn in the entire skein, measured in yards." />
            <DetailRow label="Weight of Project" value="The weight of your finished crochet piece in grams." />
            <DetailRow label="Estimated Yardage" value="The estimated length of yarn used in your project." />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable input field component
const InputField = ({ label, value, setValue }) => (
  <div className="mb-4">
    <input
      type="number"
      placeholder={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full p-2 border rounded-md"
    />
  </div>
);

// Reusable detail row component
const DetailRow = ({ label, value }) => (
  <div className="flex py-2 border-b border-gray-200 text-gray-800">
    <span className="min-w-[180px] font-semibold">{label}:</span>
    <span className="flex-1">{value}</span>
  </div>
);

export default YarnCalc;
