from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove
from PIL import Image
import io
import logging

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "https://<your-github-pages-url>"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    logger.info("Health check passed")
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    logger.info("Processing file: %s", file.filename)
    image_bytes = await file.read()
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

    # Lazy model loading
    logger.info("Removing background...")
    output_image = Image.open(io.BytesIO(remove(input_image)))

    buffer = io.BytesIO()
    output_image.save(buffer, format="PNG")
    buffer.seek(0)

    logger.info("Background removed successfully")
    return StreamingResponse(buffer, media_type="image/png")
