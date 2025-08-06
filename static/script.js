const socket = io();

// Speech recognition setup with proper fallbacks
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

// Check if speech recognition is supported
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
} else {
  console.warn("Speech recognition not supported in this browser");
}

// Language data with standardized target names for translation
const languages = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦", targetName: "Afrikaans" },
  { code: "sq", name: "Albanian", flag: "🇦🇱", targetName: "Albanian" },
  { code: "am", name: "Amharic", flag: "🇪🇹", targetName: "Amharic" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", targetName: "Arabic" },
  { code: "hy", name: "Armenian", flag: "🇦🇲", targetName: "Armenian" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿", targetName: "Azerbaijani" },
  { code: "eu", name: "Basque", flag: "🏴", targetName: "Basque" },
  { code: "be", name: "Belarusian", flag: "🇧🇾", targetName: "Belarusian" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", targetName: "Bengali" },
  { code: "bs", name: "Bosnian", flag: "🇧🇦", targetName: "Bosnian" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬", targetName: "Bulgarian" },
  { code: "ca", name: "Catalan", flag: "🏴", targetName: "Catalan" },
  { code: "ceb", name: "Cebuano", flag: "🇵🇭", targetName: "Cebuano" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳", targetName: "Simplified Chinese" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼", targetName: "Traditional Chinese" },
  { code: "co", name: "Corsican", flag: "🇫🇷", targetName: "Corsican" },
  { code: "hr", name: "Croatian", flag: "🇭🇷", targetName: "Croatian" },
  { code: "cs", name: "Czech", flag: "🇨🇿", targetName: "Czech" },
  { code: "da", name: "Danish", flag: "🇩🇰", targetName: "Danish" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", targetName: "Dutch" },
  { code: "en", name: "English", flag: "🇬🇧", targetName: "English" },
  { code: "eo", name: "Esperanto", flag: "🌍", targetName: "Esperanto" },
  { code: "et", name: "Estonian", flag: "🇪🇪", targetName: "Estonian" },
  { code: "fi", name: "Finnish", flag: "🇫🇮", targetName: "Finnish" },
  { code: "fr", name: "French", flag: "🇫🇷", targetName: "French" },
  { code: "gl", name: "Galician", flag: "🇪🇸", targetName: "Galician" },
  { code: "ka", name: "Georgian", flag: "🇬🇪", targetName: "Georgian" },
  { code: "de", name: "German", flag: "🇩🇪", targetName: "German" },
  { code: "el", name: "Greek", flag: "🇬🇷", targetName: "Greek" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳", targetName: "Gujarati" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹", targetName: "Haitian Creole" },
  { code: "ha", name: "Hausa", flag: "🇳🇬", targetName: "Hausa" },
  { code: "haw", name: "Hawaiian", flag: "🇺🇸", targetName: "Hawaiian" },
  { code: "he", name: "Hebrew", flag: "🇮🇱", targetName: "Hebrew" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", targetName: "Hindi" },
  { code: "hmn", name: "Hmong", flag: "🌏", targetName: "Hmong" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺", targetName: "Hungarian" },
  { code: "is", name: "Icelandic", flag: "🇮🇸", targetName: "Icelandic" },
  { code: "ig", name: "Igbo", flag: "🇳🇬", targetName: "Igbo" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", targetName: "Indonesian" },
  { code: "ga", name: "Irish", flag: "🇮🇪", targetName: "Irish" },
  { code: "it", name: "Italian", flag: "🇮🇹", targetName: "Italian" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", targetName: "Japanese" },
  { code: "jv", name: "Javanese", flag: "🇮🇩", targetName: "Javanese" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", targetName: "Kannada" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿", targetName: "Kazakh" },
  { code: "km", name: "Khmer", flag: "🇰🇭", targetName: "Khmer" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", targetName: "Kinyarwanda" },
  { code: "ko", name: "Korean", flag: "🇰🇷", targetName: "Korean" },
  { code: "ku", name: "Kurdish", flag: "🌍", targetName: "Kurdish" },
  { code: "ky", name: "Kyrgyz", flag: "🇰🇬", targetName: "Kyrgyz" },
  { code: "lo", name: "Lao", flag: "🇱🇦", targetName: "Lao" },
  { code: "la", name: "Latin", flag: "🏛️", targetName: "Latin" },
  { code: "lv", name: "Latvian", flag: "🇱🇻", targetName: "Latvian" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹", targetName: "Lithuanian" },
  { code: "lb", name: "Luxembourgish", flag: "🇱🇺", targetName: "Luxembourgish" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰", targetName: "Macedonian" },
  { code: "mg", name: "Malagasy", flag: "🇲🇬", targetName: "Malagasy" },
  { code: "ms", name: "Malay", flag: "🇲🇾", targetName: "Malay" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", targetName: "Malayalam" },
  { code: "mt", name: "Maltese", flag: "🇲🇹", targetName: "Maltese" },
  { code: "mi", name: "Maori", flag: "🇳🇿", targetName: "Maori" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", targetName: "Marathi" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳", targetName: "Mongolian" },
  { code: "my", name: "Myanmar (Burmese)", flag: "🇲🇲", targetName: "Burmese" },
  { code: "ne", name: "Nepali", flag: "🇳🇵", targetName: "Nepali" },
  { code: "no", name: "Norwegian", flag: "🇳🇴", targetName: "Norwegian" },
  { code: "ny", name: "Nyanja (Chichewa)", flag: "🇲🇼", targetName: "Chichewa" },
  { code: "or", name: "Odia (Oriya)", flag: "🇮🇳", targetName: "Oriya" },
  { code: "ps", name: "Pashto", flag: "🇦🇫", targetName: "Pashto" },
  { code: "fa", name: "Persian", flag: "🇮🇷", targetName: "Persian" },
  { code: "pl", name: "Polish", flag: "🇵🇱", targetName: "Polish" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", targetName: "Portuguese" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳", targetName: "Punjabi" },
  { code: "ro", name: "Romanian", flag: "🇷🇴", targetName: "Romanian" },
  { code: "ru", name: "Russian", flag: "🇷🇺", targetName: "Russian" },
  { code: "sm", name: "Samoan", flag: "🇼🇸", targetName: "Samoan" },
  { code: "gd", name: "Scots Gaelic", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", targetName: "Scots Gaelic" },
  { code: "sr", name: "Serbian", flag: "🇷🇸", targetName: "Serbian" },
  { code: "st", name: "Sesotho", flag: "🇱🇸", targetName: "Sesotho" },
  { code: "sn", name: "Shona", flag: "🇿🇼", targetName: "Shona" },
  { code: "sd", name: "Sindhi", flag: "🇵🇰", targetName: "Sindhi" },
  { code: "si", name: "Sinhala", flag: "🇱🇰", targetName: "Sinhala" },
  { code: "sk", name: "Slovak", flag: "🇸🇰", targetName: "Slovak" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮", targetName: "Slovenian" },
  { code: "so", name: "Somali", flag: "🇸🇴", targetName: "Somali" },
  { code: "es", name: "Spanish", flag: "🇪🇸", targetName: "Spanish" },
  { code: "su", name: "Sundanese", flag: "🇮🇩", targetName: "Sundanese" },
  { code: "sw", name: "Swahili", flag: "🇹🇿", targetName: "Swahili" },
  { code: "sv", name: "Swedish", flag: "🇸🇪", targetName: "Swedish" },
  { code: "tl", name: "Tagalog (Filipino)", flag: "🇵🇭", targetName: "Filipino" },
  { code: "tg", name: "Tajik", flag: "🇹🇯", targetName: "Tajik" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", targetName: "Tamil" },
  { code: "tt", name: "Tatar", flag: "🇷🇺", targetName: "Tatar" },
  { code: "te", name: "Telugu", flag: "🇮🇳", targetName: "Telugu" },
  { code: "th", name: "Thai", flag: "🇹🇭", targetName: "Thai" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", targetName: "Turkish" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲", targetName: "Turkmen" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦", targetName: "Ukrainian" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", targetName: "Urdu" },
  { code: "ug", name: "Uyghur", flag: "🇨🇳", targetName: "Uyghur" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿", targetName: "Uzbek" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", targetName: "Vietnamese" },
  { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", targetName: "Welsh" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦", targetName: "Xhosa" },
  { code: "yi", name: "Yiddish", flag: "🌍", targetName: "Yiddish" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬", targetName: "Yoruba" },
  { code: "zu", name: "Zulu", flag: "🇿🇦", targetName: "Zulu" }
];

// Populate language dropdowns with flags and names
function populateLanguages() {
  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  
  // Clear existing options
  sourceLang.innerHTML = '';
  targetLang.innerHTML = '';
  
  // Add languages to dropdowns
  languages.forEach(lang => {
    const sourceOption = document.createElement('option');
    sourceOption.value = lang.code;
    sourceOption.innerHTML = `${lang.flag} ${lang.name}`;
    
    const targetOption = document.createElement('option');
    targetOption.value = lang.code;
    targetOption.innerHTML = `${lang.flag} ${lang.name}`;
    
    sourceLang.appendChild(sourceOption);
    targetLang.appendChild(targetOption);
  });
  
  // Set defaults
  sourceLang.value = 'en';
  targetLang.value = 'es';
}

// Initialize language dropdowns when the page loads
document.addEventListener('DOMContentLoaded', populateLanguages);

// Get target language name for translation
function getTargetLanguageName(code) {
  const lang = languages.find(l => l.code === code);
  return lang ? lang.targetName : code;
}

// Send text for translation
function sendText() {
  const inputText = document.getElementById('inputText').value.trim();
  const sourceLang = document.getElementById('sourceLang').value;
  const targetLang = document.getElementById('targetLang').value;

  if (!inputText) {
    showToast('Please enter text to translate!');
    return;
  }

  // Show loading spinner
  document.getElementById('spinner').style.display = 'flex';
  
  try {
    socket.emit('translate_text', {
      input_text: inputText,
      source_lang: sourceLang,
      target_lang: targetLang,
      target_lang_name: getTargetLanguageName(targetLang)
    });
  } catch (error) {
    document.getElementById('spinner').style.display = 'none';
    showToast('Error sending translation request: ' + error.message);
    console.error('Translation error:', error);
  }
}

// Handle translation response
socket.on('translated', (data) => {
  try {
    document.getElementById('outputText').value = data.translated_text || "Translation failed";
    
    // Handle audio with cache-busting timestamp
    const timestamp = new Date().getTime();
    const inputAudio = document.getElementById('inputAudio');
    const outputAudio = document.getElementById('outputAudio');
    
    if (data.input_audio) {
      inputAudio.src = `/${data.input_audio}?t=${timestamp}`;
    }
    if (data.output_audio) {
      outputAudio.src = `/${data.output_audio}?t=${timestamp}`;
    }

    document.getElementById('spinner').style.display = 'none';
  } catch (error) {
    document.getElementById('spinner').style.display = 'none';
    showToast('Error displaying translation: ' + error.message);
    console.error('Display error:', error);
  }
});

// Audio playback handlers
document.getElementById('playInput').addEventListener('click', () => {
  const audio = document.getElementById('inputAudio');
  if (audio.src) {
    audio.play().catch(e => showToast('Error playing audio: ' + e.message));
  } else {
    showToast('No audio available');
  }
});

document.getElementById('playOutput').addEventListener('click', () => {
  const audio = document.getElementById('outputAudio');
  if (audio.src) {
    audio.play().catch(e => showToast('Error playing audio: ' + e.message));
  } else {
    showToast('No audio available');
  }
});

// Theme toggle functionality
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  // Save preference
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// Load theme preference
document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
});

// Speech recognition
function startSpeech() {
  if (!SpeechRecognition) {
    showToast('Speech recognition is not supported in your browser. Try Chrome or Edge.');
    return;
  }

  const micButton = document.getElementById('micButton');
  micButton.classList.add('recording');
  micButton.innerHTML = '<i class="fas fa-microphone"></i> 🔴 Recording...';
  
  // Set recognition language
  const langCode = document.getElementById('sourceLang').value;
  recognition.lang = langCode;
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('inputText').value = transcript;
    micButton.classList.remove('recording');
    micButton.innerHTML = '<i class="fas fa-microphone"></i> Speak';
  };

  recognition.onerror = function(event) {
    showToast('Speech recognition error: ' + event.error);
    micButton.classList.remove('recording');
    micButton.innerHTML = '<i class="fas fa-microphone"></i> Speak';
  };

  recognition.onend = function() {
    micButton.classList.remove('recording');
    micButton.innerHTML = '<i class="fas fa-microphone"></i> Speak';
  };

  recognition.start();
}

// Swap languages
document.getElementById('swapLanguages').addEventListener('click', () => {
  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  
  // Swap values
  const tempValue = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tempValue;
  
  // Swap text if there's a translation
  if (outputText.value) {
    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;
    
    // Also swap audio sources if available
    const inputAudio = document.getElementById('inputAudio');
    const outputAudio = document.getElementById('outputAudio');
    const tempSrc = inputAudio.src;
    inputAudio.src = outputAudio.src;
    outputAudio.src = tempSrc;
  }
});

// Toast notification system
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger reflow to enable CSS transition
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

// Handle socket connection errors
socket.on('connect_error', (error) => {
  showToast('Connection error: ' + error.message);
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    showToast('Server disconnected. Please refresh the page.');
  }
  console.warn('Socket disconnected:', reason);
});

// Auto-translate on Enter key (but not Shift+Enter)
document.getElementById('inputText').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendText();
  }
});