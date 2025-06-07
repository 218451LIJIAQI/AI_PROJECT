import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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

const inputMethodOptions = [
  { value: 'dropdown', icon: '🎛️', label: 'Choose Genre' },
  { value: 'text', icon: '💭', label: 'Describe Mood' },
  { value: 'image', icon: '📸', label: 'Upload Selfie' }
];

function MoodInput({ onMoodSelect, onSongsFetched, onError, isLoading: parentIsLoading }) {
  const [inputMethod, setInputMethod] = useState('dropdown');
  const [selectedMood, setSelectedMood] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
      if (onError) onError();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing indicator for text input
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setIsTyping(true);
    
    // Clear typing indicator after user stops typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Fix dropdown options styling as a backup
  const handleSelectChange = (e) => {
    setSelectedMood(e.target.value);
    
    // Force re-style all options after selection
    setTimeout(() => {
      const select = e.target;
      const options = select.querySelectorAll('option');
      options.forEach(option => {
        option.style.backgroundColor = '#1a1a2e';
        option.style.color = '#ffffff';
        option.style.fontWeight = option.selected ? '700' : '500';
      });
    }, 10);
  };

  return (
    <div className="slide-in">
      <Form onSubmit={handleSubmit}>
        {/* Input Method Selection */}
        <div className="form-group">
          <label className="form-label">✨ How would you like to express your vibe?</label>
          <div className="input-method-container">
            {inputMethodOptions.map((option) => (
              <div
                key={option.value}
                className={`input-method-card ${inputMethod === option.value ? 'active' : ''}`}
                onClick={() => setInputMethod(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setInputMethod(option.value);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={inputMethod === option.value}
                aria-label={`Select ${option.label} input method`}
              >
                <span className="input-method-icon">{option.icon}</span>
                <p className="input-method-label">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Input Based on Method */}
        {inputMethod === 'dropdown' && (
          <div className="form-group">
            <label className="form-label">🎵 Choose Your Mood/Genre</label>
            <select 
              className="form-select mood-selector" 
              value={selectedMood} 
              onChange={handleSelectChange}
              style={{
                background: 'var(--glass-bg) !important',
                color: '#ffffff !important'
              }}
            >
              <option 
                value="" 
                style={{ 
                  background: '#1a1a2e !important', 
                  backgroundColor: '#1a1a2e !important',
                  color: '#ffffff !important',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                -- Select Your Vibe --
              </option>
              {moodOptions.map(mood => (
                <option 
                  key={mood} 
                  value={mood}
                  style={{ 
                    background: '#1a1a2e !important', 
                    backgroundColor: '#1a1a2e !important',
                    color: '#ffffff !important',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '8px'
                  }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        )}

        {inputMethod === 'text' && (
          <div className="form-group">
            <label className="form-label">💭 Express Your Feelings</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="How are you feeling today? (e.g., excited, melancholy, energetic...)"
                value={textInput}
                onChange={handleTextChange}
                style={{
                  paddingRight: isTyping ? '50px' : 'var(--spacing-xl)'
                }}
              />
              {isTyping && (
                <div style={{
                  position: 'absolute',
                  right: 'var(--spacing-lg)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neon-purple)',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  ✨
                </div>
              )}
            </div>
            {textInput && !isTyping && (
              <div style={{
                marginTop: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                border: '1px solid var(--glass-border)'
              }}>
                💡 AI will analyze: "{textInput.length > 50 ? textInput.substring(0, 50) + '...' : textInput}"
              </div>
            )}
          </div>
        )}

        {inputMethod === 'image' && (
          <div className="form-group">
            <label className="form-label">📸 Upload a Selfie</label>
            <div className="file-upload-container">
              <input 
                type="file" 
                className="file-upload-input" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
              />
              <div className={`file-upload-button ${imageFile ? 'file-selected' : ''}`}>
                <div className="file-upload-icon">
                  {imageFile ? '✅' : '📸'}
                </div>
                <div className="file-upload-text">
                  {imageFile ? `Selected: ${imageFile.name}` : 'Choose Your Photo'}
                </div>
                <div className="file-upload-hint">
                  {imageFile ? 'Click to change photo' : 'JPG, PNG, or GIF • Max 10MB'}
                </div>
              </div>
            </div>
            {imageFile && (
              <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'rgba(0, 184, 148, 0.1)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(0, 184, 148, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <span style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}>✨</span>
                <div>
                  <div style={{ 
                    color: 'var(--accent-green)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    Photo Ready for Analysis
                  </div>
                  <div style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.8rem',
                    marginTop: '2px'
                  }}>
                    AI will detect your facial expression and mood
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="danger" className="alert alert-danger">
            <strong>⚠️ Oops!</strong> {error}
          </Alert>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="btn-primary w-100" 
          disabled={isLoading || parentIsLoading}
          style={{ 
            minHeight: '3.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {(isLoading || parentIsLoading) ? (
            <div className="d-flex align-items-center justify-content-center">
              <div className="loading-spinner me-3" style={{ width: '20px', height: '20px' }}></div>
              <span style={{ position: 'relative', zIndex: 2 }}>
                Discovering Your Perfect Playlist...
              </span>
            </div>
          ) : (
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              position: 'relative',
              zIndex: 2
            }}>
              🎶 Discover My Music
            </span>
          )}
        </Button>

        {/* Detected Mood Display */}
        {detectedMood && (
          <div className="detected-mood fade-in" style={{
            background: 'var(--glass-bg-strong)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-xl)',
            marginTop: 'var(--spacing-xl)',
            textAlign: 'center',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-pink), var(--neon-blue))',
              opacity: 0.8
            }} />
            <div className="detected-mood-label" style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: '500'
            }}>
              🎯 Detected Vibe:
            </div>
            <div className="detected-mood-value" style={{
              color: 'var(--neon-purple)',
              fontSize: '1.8rem',
              fontWeight: '800',
              textTransform: 'capitalize',
              textShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
              margin: 0,
              animation: 'textGlow 2s ease-in-out infinite alternate'
            }}>
              ✨ {detectedMood}
            </div>
            <div style={{
              marginTop: 'var(--spacing-md)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem'
            }}>
              🎵 Generating personalized recommendations...
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}

export default MoodInput;