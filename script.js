let voices = [];

function populateVoices() {
  voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voiceSelect');
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

speechSynthesis.onvoiceschanged = populateVoices;

function speak() {
  const text = document.getElementById('textInput').value;
  const rate = parseFloat(document.getElementById('rate').value);
  const pitch = parseFloat(document.getElementById('pitch').value);
  const voiceIndex = parseInt(document.getElementById('voiceSelect').value);
  const status = document.getElementById('status');

  if (!text.trim()) {
    status.textContent = "దయచేసి టెక్స్ట్ ఇవ్వండి.";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceIndex] || null;
  utterance.rate = rate;
  utterance.pitch = pitch;

  status.textContent = "చదువుతున్నాను...";
  speechSynthesis.speak(utterance);

  utterance.onend = () => {
    status.textContent = "పూర్తైంది!";
    addToHistory(text);
  };
}

function clearText() {
  document.getElementById('textInput').value = '';
  document.getElementById('status').textContent = '';
}

function sampleText() {
  document.getElementById('textInput').value = "హలో! ఇది తెలుగు టెక్స్ట్ టు స్పీచ్ వెబ్‌సైట్.";
}

function addToHistory(text) {
  let history = JSON.parse(localStorage.getItem("ttsHistory")) || [];
  if (!history.includes(text)) {
    history.unshift(text);
    if (history.length > 10) history.pop();
    localStorage.setItem("ttsHistory", JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("ttsHistory")) || [];
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  history.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    li.onclick = () => {
      document.getElementById('textInput').value = text;
      speak();
    };
    list.appendChild(li);
  });
}

document.getElementById('themeToggle').onclick = () => {
  document.body.classList.toggle('light');
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") document.body.classList.add("light");
}

window.onload = () => {
  populateVoices();
  renderHistory();
  loadTheme();
};