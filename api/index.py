from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

try:
    if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
        client = genai.Client(api_key=GEMINI_API_KEY)
    else:
        client = None
        print("WARNING: Valid GEMINI_API_KEY not found in .env")
except Exception as e:
    client = None
    print(f"Error initializing client: {e}")

# Load the JSON kb resiliently (handling Vercel's relative paths)
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(base_dir, "data", "tamil_nadu_government_schemes.json")

try:
    with open(data_path, "r", encoding="utf-8") as f:
        kb = f.read()
except Exception as e:
    print(f"Error loading schemes data at {data_path}: {e}")
    kb = "{}"

prompt = f"""
நீங்கள் தமிழ்நாடு அரசு திட்டங்கள் உதவியாளர் (Tamil Nadu Government Schemes Assistant).

உங்கள் வேலை:
1. திட்டங்களை எளிய தமிழில் விளக்குவது
2. யார் தகுதியானவர்கள் என்று சொல்வது
3. எப்படி விண்ணப்பிக்கணும் என்று வழிகாட்டுவது

விதிகள் (Rules):
- எப்போதும் எளிய தமிழில் பதில் சொல்லுங்கள் (ஆங்கில வார்த்தைகள் குறைவாக பயன்படுத்துங்கள்)
- அன்பாகவும் மரியாதையாகவும் பேசுங்கள்
- கீழே கொடுக்கப்பட்ட தகவல்களை மட்டுமே பயன்படுத்துங்கள்
- தெரியாத கேள்விகளுக்கு "இந்த தகவல் என்னிடம் இல்லை, அருகில் உள்ள அரசு அலுவலகத்தில் கேளுங்கள்" என்று சொல்லுங்கள்
- திட்டத்தின் பயன்கள், தகுதி நிபந்தனைகள், விண்ணப்ப முறை ஆகியவற்றை தெளிவாக சொல்லுங்கள்
- ரூபாய் தொகையை தமிழில் சொல்லுங்கள் (உதாரணம்: மாதம் ஆயிரம் ரூபாய்)

திட்ட தகவல்கள் (Knowledge Base):
{kb}
"""

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_bot(req: ChatRequest):
    if not client:
        return {"error": "API Key not configured properly. The administrator needs to set GEMINI_API_KEY."}
    try:
        chat = client.chats.create(
            model='gemini-2.5-flash',
            config={
                'system_instruction': prompt,
                'temperature': 0.7
            }
        )
        response = chat.send_message(req.message)
        return {"response": response.text}
    except Exception as e:
        return {"error": repr(e)}
