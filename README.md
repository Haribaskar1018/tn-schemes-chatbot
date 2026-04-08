# Tamil Nadu Government Schemes Chatbot 🏛️🤖

![TN Schemes Hub Cover Graphic](cards_screenshot.png) <!-- Feel free to update with a real cover image if you like! -->

A highly visual, culturally immersive AI Chatbot designed to help citizens of Tamil Nadu discover and understand 50+ government welfare schemes. Powered by Google Gemini 2.5 Flash and FastAPI.

## ✨ Features

- **AI-Powered Assistant**: Instant, accurate answers in simple Tamil based on an extensive JSON knowledge base of government schemes.
- **Bilingual Support**: Understands queries and provides information in both Tamil and English.
- **Stunning UI/UX**: Premium aesthetic featuring Deep Emerald Green and Sandalwood Gold, animated particle backgrounds, 3D glassmorphic cards, and traditional Kolam SVG dividers.
- **11 Curated Categories**: Cards span Women Empowerment, Agriculture, Education, Health, Housing, and more.
- **RAG Architecture**: Uses Retrieval-Augmented Generation principles, grounding the AI in official verified scheme data rather than hallucinating details.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla + Glassmorphism), JavaScript (Vanilla)
- **Backend / API**: Python 3.x, FastAPI, Uvicorn
- **AI / LLM**: Google GenAI SDK (`gemini-2.5-flash`)
- **Data**: JSON Knowledge Base

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

1. **Python 3.8+** installed on your system.
2. A **Google Gemini API Key**. You can get one for free from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Haribaskar1018/tn-schemes-chatbot.git
   cd tn-schemes-chatbot
   ```

2. **Set up a Virtual Environment (Recommended):**
   ```bash
   python -m venv venv
   
   # For Windows:
   .\venv\Scripts\Activate.ps1
   
   # For Mac/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Add Your API Key:**
   - Copy the sample environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google AI Studio API key.

### Running the Application

1. **Start the FastAPI Backend:**
   Ensure your virtual environment is active, then run:
   ```bash
   python backend.py
   ```
   *The server will start on `http://localhost:8000`.*

2. **Open the Frontend:**
   You can either:
   - Run a local static server (e.g., `python -m http.server 8080`) and visit `http://localhost:8080/index.html`
   - Or simply double-click `index.html` to open it in your browser.

---

## 📂 Project Structure

```text
📦 tn-schemes-chatbot
 ┣ 📂 css
 ┃ ┗ 📜 styles.css          # Beautiful Tamil heritage styling
 ┣ 📂 data
 ┃ ┗ 📜 tamil_nadu_government_schemes.json # Verified schemes KB
 ┣ 📂 js
 ┃ ┗ 📜 app.js              # Frontend logic and API integration
 ┣ 📜 .env.example          # Template for your environment variables
 ┣ 📜 .gitignore            # Keeps your API keys safe!
 ┣ 📜 backend.py            # FastAPI server connecting to Gemini
 ┣ 📜 index.html            # Main User Interface
 ┗ 📜 requirements.txt      # Python dependencies
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/Haribaskar1018/tn-schemes-chatbot/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ for the people of Tamil Nadu.</p>
