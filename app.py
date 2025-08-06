import os
from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from groq import Client
from translate_engine import translate_text

load_dotenv()
app = Flask(__name__, static_folder="static")
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# GROQ Client setup
groq_client = Client(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@socketio.on('translate_text')
def handle_translation(data):
    try:
        input_text = data.get('input_text', '')
        target_lang_name = data.get('target_lang_name', 'Spanish')  # eg: 'Spanish'
        
        translated = translate_text(input_text, target_lang_name)
        emit('translated', {
            'translated_text': translated,
            'input_audio': '',    # Future scope
            'output_audio': ''    # Future scope
        })
    except Exception as e:
        emit('translated', {'translated_text': f'Error: {str(e)}'})

if __name__ == "__main__":
    socketio.run(app, debug=True)
