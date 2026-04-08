from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
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
    if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_NEW_VALID_API_KEY_HERE":
        client = genai.Client(api_key=GEMINI_API_KEY)
    else:
        client = None
        print("WARNING: Valid GEMINI_API_KEY not found in .env")
except Exception as e:
    client = None
    print(f"Error initializing client: {e}")

# Load the JSON kb
try:
    with open("data/tamil_nadu_government_schemes.json", "r", encoding="utf-8") as f:
        kb = f.read()
except Exception as e:
    print(f"Error loading schemes data: {e}")
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

@app.post("/chat")
def chat_with_bot(req: ChatRequest):
    if not client:
        return {"error": "API Key not configured properly in .env"}
    try:
        # Note: types.GenerateContentConfig might not be directly available like this based on exact version,
        # but using dict for config is fine based on the user's snippet. Let's use the user's exact format.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
