from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from models.CrochetModel import CrochetModel
from pydantic import BaseModel
import os

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize Crochet Model
crochet_model = CrochetModel()


class StitchRequest(BaseModel):
    stitch_type: str
    amount: int

@app.post("/add_stitch")
def add_stitch(request: StitchRequest):
    isRedo = False
    max_length = crochet_model.get_max_length()

    if request.amount > 100:
        return JSONResponse(status_code=400, content={"message": "Amount exceeds the allowed limit."})

    new_length = request.amount + crochet_model.cur_row.get_array_size()
    if new_length > max_length and request.stitch_type != "Chain":
        request.amount = max_length - crochet_model.cur_row.get_array_size()

    if request.amount > 0:
        crochet_model.addToRow(request.stitch_type, request.amount, isRedo)
        return JSONResponse(content={"message": f"Added {request.amount} {request.stitch_type} stitches."})

    return JSONResponse(status_code=400, content={"message": "Invalid stitch amount."})



@app.post("/add_stitch")
def add_stitch(stitch_type: str, amount: int):
    """ API equivalent of `add_command()` """
    isRedo = False
    max_length = crochet_model.get_max_length()

    if amount > 100:
        return JSONResponse(status_code=400, content={"message": "Amount exceeds the allowed limit."})

    new_length = amount + crochet_model.cur_row.get_array_size()
    if new_length > max_length and stitch_type != "Chain":
        amount = max_length - crochet_model.cur_row.get_array_size()

    if amount > 0:
        crochet_model.addToRow(stitch_type, amount, isRedo)
        return JSONResponse(content={"message": f"Added {amount} {stitch_type} stitches."})
    
    return JSONResponse(status_code=400, content={"message": "Invalid stitch amount."})


@app.post("/new_row")
def new_row():
    """ API equivalent of `new_command()` """
    isRedo = False
    crochet_model.newRow(isRedo)
    
    # Return updated dropdown options based on row count
    if crochet_model.get_row_count() > 1:
        stitch_options = ["Single", "Double", "Half-Double", "Slip"]
    else:
        stitch_options = ["Chain"]
    
    return {"message": "New row added.", "stitch_options": stitch_options}


@app.post("/undo")
def undo():
    response = crochet_model.undo()  # Ensure correct response is returned
    return response




@app.post("/redo")
def redo():
    """ API equivalent of `redo_command()` """
    crochet_model.redo()
    return {
        "message": "Redo last action.",
        "row_count": crochet_model.get_row_count(),
        "stitch_count": crochet_model.get_stitch_count(),
        "stitch_options": ["Single", "Double", "Half-Double", "Slip"] if crochet_model.get_row_count() > 1 else ["Chain"]
    }


@app.post("/clear_pattern")
def clear_pattern():
    """ Reinitialize Crochet Model without losing reference """
    print("🔄 Clearing pattern...")
    crochet_model.clearPattern()  # Reset the model properly

    print("✅ Pattern reset completed. Returning response...")
    return {
        "message": "Pattern cleared.",
        "row_count": crochet_model.get_row_count(),
        "stitch_count": crochet_model.get_stitch_count(),
        "stitch_options": ["Chain"]
    }






@app.get("/get_counts")
def get_counts():
    """ API equivalent of updating row and stitch counts """
    return {
        "row_count": crochet_model.get_row_count(),
        "stitch_count": crochet_model.get_stitch_count()
    }


@app.get("/get_max_length")
def get_max_length():
    """ Returns the maximum allowed stitch length """
    return {"max_length": crochet_model.get_max_length()}


from fastapi.responses import FileResponse

@app.get("/render_pattern")
def render_pattern():
    """ API equivalent of `update_image()` """
    print("🔄 Rendering pattern...")

    try:
        crochet_model.build()  # Ensure model is rebuilt
        png_path = os.getcwd() + "/models/assets/model.png"

        if not os.path.exists(png_path):
            print("❌ PNG file not found! Rendering might have failed.")

        return FileResponse(png_path, media_type="image/png")

    except Exception as e:
        print(f"❌ Error rendering pattern: {e}")
        return JSONResponse(status_code=500, content={"message": str(e)})



@app.get("/generate_written_pattern")
def generate_written_pattern():
    """ API equivalent of `create_command()` """
    written_pattern = crochet_model.generate_written_pattern()
    return {"written_pattern": written_pattern}
