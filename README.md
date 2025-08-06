# Translator App 

**Translator App Pro** is a real-time multilingual translation web application built with **Python (Flask)** and **Groq API**.  
It allows users to translate text between 100+ languages instantly, with a clean, responsive interface.  
This project demonstrates skills in **full‑stack development, AI API integration, and secure environment configuration**.

## Features
-  Translate text across 100+ languages
-  Instant, real-time results (no page reload)
-  Responsive UI for desktop and mobile
-  Secure API key handling with `.env`

## Tech Stack
**Backend:** Python, Flask  
**Frontend:** HTML5, CSS3, JavaScript  
**API:** Groq API (or other translation APIs)  
**Version Control:** Git & GitHub  

## Getting Started
```bash
# Clone repository
git clone https://github.com/Mahitha1229/translator-app.git
cd translator-app

# (Optional) Create and activate virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your API key to .env
GROQ_API_KEY=your_api_key_here

# Run application
python app.py
