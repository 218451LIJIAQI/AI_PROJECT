import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
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
  { value: 'dropdown', icon: '🎛️', label: 'Choose Genre', description: 'Select from curated music genres' },
  { value: 'text', icon: '💭', label: 'Describe Mood', description: 'Describe how you\'re feeling in words' },
  { value: 'image', icon: '📸', label: 'Upload Selfie', description: 'Let AI analyze your facial expression' }
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
  const [currentStep, setCurrentStep] = useState(1);

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
    <div className="desktop-mood-input slide-in">
      <div className="glass-card desktop-input-card liquid-border">
        <Form onSubmit={handleSubmit}>
              <div className="content-header text-center mb-4">
                <h2 className="desktop-section-title dynamic-text">
                  {currentStep === 1 ? 'Choose Your Perfect Vibe' : 
                   currentStep === 2 ? 'Express Your Music Mood' :
                   'Upload Your Inspiration'}
                  
                  {/* Audio Visualizer */}
                  <div className="audio-bars mt-3">
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                    <div className="audio-bar"></div>
                  </div>
                </h2>
                
                <p className="page-subtitle neon-text">
                  Let your emotions guide the perfect musical journey
                </p>
              </div>

              {/* Input Method Selection - Desktop Grid Layout */}
              <div className="form-group">
                <label className="form-label desktop-section-title">
                  ✨ Choose Your Input Method
                </label>
                <div className="desktop-input-methods">
                  <div 
                    className={`desktop-method-card ${currentStep === 1 ? 'active' : ''} morph-button`}
                    onClick={() => {
                      setCurrentStep(1);
                      setInputMethod('dropdown');
                    }}
                    data-tooltip="Select from curated moods"
                  >
                    <div className="method-card-header">
                      <span className="method-icon">🎛️</span>
                      <h4 className="method-title">Choose Genre</h4>
                    </div>
                    <p className="method-description">Select from curated music genres</p>
                  </div>

                  <div 
                    className={`desktop-method-card ${currentStep === 2 ? 'active' : ''} morph-button`}
                    onClick={() => {
                      setCurrentStep(2);
                      setInputMethod('text');
                    }}
                    data-tooltip="Describe your perfect vibe"
                  >
                    <div className="method-card-header">
                      <span className="method-icon">💭</span>
                      <h4 className="method-title">Describe Mood</h4>
                    </div>
                    <p className="method-description">Describe how you're feeling in words</p>
                  </div>

                  <div 
                    className={`desktop-method-card ${currentStep === 3 ? 'active' : ''} morph-button`}
                    onClick={() => {
                      setCurrentStep(3);
                      setInputMethod('image');
                    }}
                    data-tooltip="Upload image for mood analysis"
                  >
                    <div className="method-card-header">
                      <span className="method-icon">📸</span>
                      <h4 className="method-title">Upload Selfie</h4>
                    </div>
                    <p className="method-description">Let AI analyze your facial expression</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Input Section */}
              <div className="desktop-dynamic-input">
                {currentStep === 1 && (
                  <Row>
                    <Col lg={10} className="mx-auto">
                      <div className="form-group">
                        <label className="form-label desktop-input-label">🎵 Select Your Music Genre</label>
                        <select 
                          className="form-select desktop-mood-selector" 
                          value={selectedMood} 
                          onChange={(e) => {
                            setSelectedMood(e.target.value);
                            setInputMethod('dropdown');
                          }}
                        >
                          <option value="">Select Music Vibe</option>
                          {moodOptions.map(mood => (
                            <option key={mood} value={mood}>
                              {mood.charAt(0).toUpperCase() + mood.slice(1).replace(/-/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                )}

                {currentStep === 2 && (
                  <Row>
                    <Col lg={8} className="mx-auto">
                      <div className="form-group">
                        <label className="form-label desktop-input-label">
                          💭 Describe Your Current Mood
                          {isTyping && <span className="typing-indicator">✍️ Typing...</span>}
                        </label>
                        <textarea
                          className="form-control desktop-text-area"
                          value={textInput}
                          onChange={handleTextChange}
                          placeholder="e.g., I'm feeling energetic and ready to dance, or I'm in a mellow, reflective mood..."
                          rows={4}
                        />
                        <small className="input-hint">
                          💡 Be descriptive! The more details you provide, the better AI can understand your vibe
                        </small>
                      </div>
                    </Col>
                  </Row>
                )}

                {currentStep === 3 && (
                  <Row>
                    <Col lg={8} md={10} className="mx-auto">
                      <div className="form-group">
                        <label className="form-label desktop-input-label">📸 Upload Your Selfie</label>
                        <div className="desktop-file-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="file-upload-input"
                            id="selfie-upload"
                          />
                          <label htmlFor="selfie-upload" className="desktop-file-upload-label">
                            <div className="upload-icon">📸</div>
                            <div className="upload-content">
                              <p className="upload-text">
                                {imageFile ? (
                                  <span>
                                    <strong>Selected:</strong><br />
                                    <span className="file-name-display">
                                      {imageFile.name.length > 20 ? `${imageFile.name.substring(0, 20)}...` : imageFile.name}
                                    </span>
                                  </span>
                                ) : 'Tap to select image'}
                              </p>
                              <small className="upload-hint">
                                JPG, PNG or GIF • Max 10MB
                              </small>
                            </div>
                          </label>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>

              {/* Submit Section */}
              <div className="desktop-submit-section">
                <Row>
                  <Col lg={6} className="mx-auto text-center">
                    {error && (
                      <Alert variant="danger" className="desktop-alert">
                        <strong>Oops! </strong>{error}
                      </Alert>
                    )}
                    
                    {detectedMood && (
                      <div className="desktop-detected-mood">
                        <span className="detected-label">🎯 Detected Mood:</span>
                        <span className="detected-value">{detectedMood}</span>
                      </div>
                    )}

                                          <Button 
                        type="submit"
                        className={`desktop-submit-btn morph-button neon-text ${isLoading || parentIsLoading ? 'is-loading' : ''}`}
                        disabled={(!selectedMood && !textInput && !imageFile) || isLoading || parentIsLoading}
                        size="lg"
                        data-tooltip={isLoading || parentIsLoading ? 'Processing...' : 'Start discovering music'}
                      >
                      {isLoading || parentIsLoading ? (
                        <>
                          <div className="btn-spinner"></div>
                          Processing Your Vibe...
                        </>
                      ) : (
                        <>
                          🚀 Discover Music
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </div>
        </Form>
      </div>
    </div>
  );
}

export default MoodInput;