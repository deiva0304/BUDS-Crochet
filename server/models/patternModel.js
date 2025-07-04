import mongoose from "mongoose";

const patternSchema = new mongoose.Schema({
    patternName: { type: String, required: true },
    size: { type: String, default: "" },
    yarn: { type: String, default: "" },
    needleSize: { type: String, default: "" },
    gauge: { type: String, default: "" },
    lot: { type: String, default: "" },
    numOfSkeins: { type: String, default: "" },
    yardage: { type: String, default: "" },
    description: { type: String, default: "" },

    // Pattern Visualization
    imageBase64: { type: String, default: "" }, // Stores base64 encoded image

    // Generated Instructions
    generatedInstructions: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Link to user
    currentRow: { type: Number, default: 1 }, // ✅ Track the current row
    rowData: [{
        rowNumber: { type: Number, required: true },
        stitches: { type: Number, default: 0 } // ✅ Stitches per row
    }],
    createdAt: { type: Date, default: Date.now }
});

// ✅ Fix: Export `patternSchema` for reuse in `userSchema`
const patternModel = mongoose.model("Pattern", patternSchema);

export default patternModel;
