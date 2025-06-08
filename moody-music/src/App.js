// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';  
import MoodInput from './components/MoodInput';
import SongSuggestions from './components/SongSuggestions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Floating music notes component
const FloatingNotes = () => {
  const notes = ['🎵', '🎶', '♪', '♫', '🎼'];
  const [noteElements, setNoteElements] = useState([]);

  useEffect(() => {
    const generateNotes = () => {
      const newNotes = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        note: notes[Math.floor(Math.random() * notes.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: 3 + Math.random() * 2
      }));
      setNoteElements(newNotes);
    };

    generateNotes();
    const interval = setInterval(generateNotes, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {noteElements.map((item) => (
        <div
          key={item.id}
          className="music-note"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.animationDelay}s`,
            animationDuration: `${item.animationDuration}s`
          }}
        >
          {item.note}
        </div>
      ))}
    </div>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = ({ currentStep, mood, songsCount, resetToInput }) => {
  return (
    <div className="desktop-sidebar">
      <div className="sidebar-content">
        {/* App Branding */}
        <div className="sidebar-branding">
          <h1 className="sidebar-title">
            🎵 MusicAI
          </h1>
          <p className="sidebar-subtitle">
            AI-Powered Music Discovery
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`progress-step ${currentStep === 'input' ? 'active' : currentStep === 'loading' || currentStep === 'results' ? 'completed' : ''}`}>
            <div className="step-icon">🎯</div>
            <div className="step-content">
              <h4>Select Mood</h4>
              <p>Choose how you're feeling</p>
            </div>
          </div>
          
          <div className={`progress-step ${currentStep === 'loading' ? 'active' : currentStep === 'results' ? 'completed' : ''}`}>
            <div className="step-icon">🤖</div>
            <div className="step-content">
              <h4>AI Analysis</h4>
              <p>Processing your vibe</p>
            </div>
          </div>
          
          <div className={`progress-step ${currentStep === 'results' ? 'active' : ''}`}>
            <div className="step-icon">🎵</div>
            <div className="step-content">
              <h4>Music Results</h4>
              <p>{songsCount > 0 ? `${songsCount} songs found` : 'Discover tracks'}</p>
            </div>
          </div>
        </div>

        {/* Current Session Info */}
        {mood && (
          <div className="session-info">
            <h4>Current Session</h4>
            <div className="current-mood">
              <span className="mood-label">Mood:</span>
              <span className="mood-value">{mood}</span>
            </div>
            {currentStep === 'results' && (
              <button
                className="reset-btn"
                onClick={resetToInput}
              >
                🔄 New Search
              </button>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="sidebar-footer">
          <p>Powered by Spotify API</p>
          <p>Built with React & AI</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [mood, setMood] = useState('');
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'loading', 'results'

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    setCurrentStep('loading');
    setIsLoading(true);
  };

  const handleSongsFetched = (fetchedSongs) => {
    setSongs(fetchedSongs);
    setIsLoading(false);
    setCurrentStep('results');
  };

  const handleError = () => {
    setIsLoading(false);
    setCurrentStep('input');
  };

  const resetToInput = () => {
    setCurrentStep('input');
    setSongs([]);
    setMood('');
    setIsLoading(false);
  };

  return (
    <div className="desktop-app-container">
      <FloatingNotes />
      
      <div className="desktop-layout">
        {/* Desktop Sidebar */}
        <DesktopSidebar 
          currentStep={currentStep}
          mood={mood}
          songsCount={songs.length}
          resetToInput={resetToInput}
        />

        {/* Main Content Area */}
        <div className="main-content-area">
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col xs={12} className="main-content-col">
                {/* Main Content Header */}
                <div className="content-header">
                  <h2 className="page-title">
                    {currentStep === 'input' && '🎯 What\'s Your Vibe?'}
                    {currentStep === 'loading' && '🤖 Analyzing Your Mood...'}
                    {currentStep === 'results' && `🎵 ${songs.length} Songs for ${mood}`}
                  </h2>
                  {currentStep === 'input' && (
                    <p className="page-subtitle">
                      Choose how you'd like to express your current mood and let AI find the perfect soundtrack
                    </p>
                  )}
                </div>

                {/* Input Section */}
                {currentStep === 'input' && (
                  <div className="input-section">
                    <MoodInput
                      onMoodSelect={handleMoodSelect}
                      onSongsFetched={handleSongsFetched}
                      onError={handleError}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {/* Results Section */}
                {(currentStep === 'loading' || currentStep === 'results') && (
                  <div className="results-section">
                    <SongSuggestions songs={isLoading ? null : songs} mood={mood} />
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default App;
