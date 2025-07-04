import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {  
    addNewRow,
    deletePattern,
    getPatternDetails,
    getUserPatterns, 
    removeLastRow, 
    savePatternData, 
    updatePatternInstructions, 
    updateRowCounter
} from '../controllers/patternController.js';

const patternRouter = express.Router();

// ✅ Route to fetch all patterns of a user
patternRouter.get("/get-patterns/:email", getUserPatterns);

// ✅ Route to fetch a single pattern by ID
patternRouter.get("/get-pattern/:patternId", getPatternDetails);

// Route to save a new pattern
patternRouter.post('/save-pattern', userAuth, savePatternData);

// Route to update both instructions & image
patternRouter.put('/update-pattern/:patternId', userAuth, updatePatternInstructions);
patternRouter.put("/add-row/:patternId", userAuth, addNewRow);

patternRouter.put("/update-row/:patternId",userAuth, updateRowCounter);

patternRouter.put("/remove-row/:patternId",userAuth, removeLastRow);

patternRouter.delete("/delete-pattern/:patternId", deletePattern);

export default patternRouter;
