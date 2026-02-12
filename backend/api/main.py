from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove
from PIL import Image
import io

app = FastAPI()

# ✅ CORS (keep this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

    output = remove(image)

    buffer = io.BytesIO()
    output.save(buffer, format="PNG")
    buffer.seek(0)

    # ✅ THIS IS THE KEY FIX
    return StreamingResponse(
        buffer,
        media_type="image/png"
    )
