from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import sys
import traceback
import requests
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
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return {"error": "API Key not configured properly. The administrator needs to set GEMINI_API_KEY."}
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "systemInstruction": {
            "parts": [{"text": prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": req.message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        
        if "error" in response_data:
            return {"error": f"Google API Error: {response_data['error'].get('message', 'Unknown error')}"}
            
        text = response_data['candidates'][0]['content']['parts'][0]['text']
        return {"response": text}
    except Exception as e:
        return {"error": repr(e)}

@app.get("/")
def read_root():
    return {"message": "FastAPI is running! However, Vercel is routing all traffic here instead of your index.html."}
