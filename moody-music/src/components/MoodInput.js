import React, { useState } from 'react';
import { Form, Button, Spinner, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { fetchSongsByMood } from './apiService';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const moodOptions = [
  "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", 
  "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", 
  "british", "cantopop", "chicago-house", "children", "chill", "classical", 
  "club", "comedy", "country", "dance", "dancehall", "death-metal", 
  "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", 
  "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", 
  "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", 
  "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", 
  "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", 
  "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", 
  "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", 
  "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", 
  "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", 
  "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", 
  "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", 
  "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", 
  "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", 
  "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", 
  "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", 
  "trance", "trip-hop", "turkish", "work-out", "world-music"
];
function MoodInput({ onMoodSelect, onSongsFetched }) {
  const [inputMethod, setInputMethod] = useState('dropdown');
  const [selectedMood, setSelectedMood] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDetectedMood('');
    if (inputMethod === 'dropdown' && !selectedMood) {
      setError('Please select a mood from the dropdown.');
      return;
    }
    if (inputMethod === 'text' && !textInput.trim()) {
      setError('Please enter how you feel in the text input.');
      return;
    }
    if (inputMethod === 'image' && !imageFile) {
      setError('Please upload an image.');
      return;
    }

    setIsLoading(true);
    try {
      let mood = '';

      if (inputMethod === 'dropdown') {
        mood = selectedMood;
      } else if (inputMethod === 'text') {
        const res = await axios.post(`${API_BASE_URL}/detect-text-mood/`, { text: textInput });
        mood = res.data.mood;
      } else if (inputMethod === 'image') {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await axios.post(`${API_BASE_URL}/detect-image-emotion/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const emotion = res.data.emotion.toLowerCase();
        // 映射情绪到已知标签（如果你数据库中没有该情绪，要做判断）
        if (["happy", "sad", "angry", "surprise", "neutral", "fear", "disgust"].includes(emotion)) {
          mood = emotion.charAt(0).toUpperCase() + emotion.slice(1); // e.g., "Happy"
        } else {
          mood = "Party"; // fallback
        }
      }

      setDetectedMood(mood);
      onMoodSelect(mood);
      const songs = await fetchSongsByMood(mood);
      onSongsFetched(songs);
    } catch (err) {
      console.error(err);
      setError('Failed to detect mood or fetch songs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm bg-white rounded-lg">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Select Input Method</strong></Form.Label>
            <div>
              <Form.Check inline label="Dropdown" name="inputMethod" type="radio"
                value="dropdown" checked={inputMethod === 'dropdown'} onChange={() => setInputMethod('dropdown')} />
              <Form.Check inline label="Text Input" name="inputMethod" type="radio"
                value="text" checked={inputMethod === 'text'} onChange={() => setInputMethod('text')} />
              <Form.Check inline label="Upload Image" name="inputMethod" type="radio"
                value="image" checked={inputMethod === 'image'} onChange={() => setInputMethod('image')} />
            </div>
          </Form.Group>

          {inputMethod === 'dropdown' && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Choose Your Mood/Genre</strong></Form.Label>
              <Form.Select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
                <option value="">-- Select Mood --</option>
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {inputMethod === 'text' && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Express Your Feelings</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="How are you feeling today?"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </Form.Group>
          )}

          {inputMethod === 'image' && (
            <Form.Group className="mb-3">
              <Form.Label><strong>Upload a Selfie</strong></Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </Form.Group>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
            {isLoading ? 'Detecting...' : 'Get Songs'}
          </Button>

          {detectedMood && (
            <div className="mt-3 text-center text-secondary">
              <small>Detected Mood: <strong>{detectedMood}</strong></small>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default MoodInput;