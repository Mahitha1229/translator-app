import os
from groq import Client
from dotenv import load_dotenv

load_dotenv()

groq_client = Client(api_key=os.getenv("GROQ_API_KEY"))

def translate_text(text, target_language):
    try:
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a highly accurate language translator. Always return only the translated text without any additional commentary or explanations."
                },
                {
                    "role": "user",
                    "content": f"Translate the following text to {target_language}. Return only the translated text, nothing else. Text to translate: {text}"
                }
            ],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Translation failed: {str(e)}"
