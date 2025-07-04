import userModel from "../models/userModel.js";
import patternModel from "../models/patternModel.js"; // Import pattern schema

/**
 * ✅ GET - Retrieve all patterns for a user
 */
export const getUserPatterns = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const patterns = await patternModel.find({ userId: user._id });
    res.status(200).json({ patterns });
  } catch (error) {
    console.error("❌ Error fetching patterns:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


/**
 * ✅ GET - Retrieve details of a specific pattern
 */
export const getPatternDetails = async (req, res) => {
  try {
    const { patternId } = req.params;
    const pattern = await patternModel.findById(patternId);

    if (!pattern) {
      return res.status(404).json({ message: "Pattern not found" });
    }

    res.status(200).json({ pattern });
  } catch (error) {
    console.error("❌ Error fetching pattern details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * PUT - Update Row Counter (Stitches Per Row)
 */
export const updateRowCounter = async (req, res) => {
  try {
    const { patternId } = req.params;
    const { currentRow, stitches } = req.body;

    const pattern = await patternModel.findById(patternId);
    if (!pattern) return res.status(404).json({ message: "Pattern not found" });

    // ✅ Update row data
    let rowIndex = pattern.rowData.findIndex(row => row.rowNumber === currentRow);

    if (rowIndex === -1) {
      // ✅ If row doesn't exist, create a new row
      pattern.rowData.push({ rowNumber: currentRow, stitches });
    } else {
      // ✅ Update existing row
      pattern.rowData[rowIndex].stitches = stitches;
    }

    // ✅ Set current row
    pattern.currentRow = currentRow;
    await pattern.save();

    res.status(200).json({ message: "Row counter updated", pattern });
  } catch (error) {
    console.error("Error updating row counter:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT - Add a New Row
 */
export const addNewRow = async (req, res) => {
  try {
    const { patternId } = req.params;
    const pattern = await patternModel.findById(patternId);
    if (!pattern) return res.status(404).json({ message: "Pattern not found" });

    pattern.currentRow += 1; // ✅ Move to the next row
    pattern.rowData.push({ rowNumber: pattern.currentRow, stitches: 0 }); // ✅ Start with 0 stitches
    await pattern.save();

    res.status(200).json({ message: "New row added", pattern });
  } catch (error) {
    console.error("Error adding new row:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT - Remove the Last Row
 */
export const removeLastRow = async (req, res) => {
  try {
    const { patternId } = req.params;
    const pattern = await patternModel.findById(patternId);
    if (!pattern) return res.status(404).json({ message: "Pattern not found" });

    if (pattern.rowData.length > 1) {
      pattern.rowData.pop(); // ✅ Remove the last row
      pattern.currentRow = pattern.rowData[pattern.rowData.length - 1].rowNumber; // ✅ Update current row
    } else {
      pattern.currentRow = 1;
    }

    await pattern.save();
    res.status(200).json({ message: "Last row removed", pattern });
  } catch (error) {
    console.error("Error removing row:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST - Save a new pattern
 */
export const savePatternData = async (req, res) => {
  try {
    console.log("📌 Incoming request to save pattern:", req.body);
    const {
      patternName,
      size,
      yarn,
      needleSize,
      gauge,
      lot,
      numOfSkeins,
      yardage,
      description,
      userId,
    } = req.body;

    const user = await userModel.findById(userId).populate("patterns"); // ✅ Populate patterns

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if pattern already exists
    const existingPattern = user.patterns.find(
      (pattern) => pattern.patternName === patternName
    );

    if (existingPattern) {
      return res
        .status(400)
        .json({ message: "Pattern with this name already exists." });
    }

    // Create pattern in the `patternModel` collection
    const newPattern = new patternModel({
      patternName,
      size,
      yarn,
      needleSize,
      gauge,
      lot,
      numOfSkeins,
      yardage,
      description,
      imageBase64: "", // Initially empty
      generatedInstructions: "", // Initially empty
      createdAt: new Date(),
      userId: user._id, // Associate with user
    });

    const savedPattern = await newPattern.save(); // Save in patternSchema

    // Add pattern ID reference to user
    user.patterns.push(savedPattern._id);
    await user.save();

    console.log(
      "✅ Pattern saved successfully! New count:",
      user.patterns.length
    );

    res.status(201).json({
      message: "Pattern saved successfully",
      patternId: savedPattern._id, // ✅ Send the saved pattern ID
      pattern: savedPattern,
    });
  } catch (error) {
    console.error("Error saving pattern data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * PUT - Update generated instructions for a pattern
 */
export const updatePatternInstructions = async (req, res) => {
  try {
    const { patternId } = req.params;
    const { generatedInstructions, imageBase64 } = req.body; // Accept both instructions & image
    const userEmail = req.user.email;

    // Find user
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find pattern by ID
    const pattern = user.patterns.id(patternId);
    if (!pattern) {
      return res.status(404).json({ message: "Pattern not found" });
    }

    // Update pattern fields
    if (generatedInstructions)
      pattern.generatedInstructions = generatedInstructions;
    if (imageBase64) pattern.imageBase64 = imageBase64;

    // Save updates
    await user.save();

    res.status(200).json({ message: "Pattern updated successfully", pattern });
  } catch (error) {
    console.error("Error updating pattern:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePattern = async (req, res) => {
  try {
    const { patternId } = req.params;

    // ✅ Delete from pattern collection
    const deletedPattern = await patternModel.findByIdAndDelete(patternId);

    if (!deletedPattern) {
      return res.status(404).json({ message: "Pattern not found" });
    }

    // ✅ Remove pattern reference from user
    await userModel.updateOne(
      { patterns: patternId },
      { $pull: { patterns: patternId } }
    );

    res.status(200).json({ message: "Pattern deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting pattern:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

