// src/App.js
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';  
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
      const newNotes = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        note: notes[Math.floor(Math.random() * notes.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: 3 + Math.random() * 2
      }));
      setNoteElements(newNotes);
    };

    generateNotes();
    const interval = setInterval(generateNotes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
    <div className="main-app-container">
      <FloatingNotes />
      
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 py-5">
        <div className="glass-card fade-in" style={{ 
          width: '100%', 
          maxWidth: '900px',
          padding: '3rem 2.5rem 4rem',
          position: 'relative'
        }}>
          {/* Enhanced App Title with Dynamic Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h1 className="app-title">
              🎵 MusicAI
              <br />
              <span style={{ 
                fontSize: '0.5em', 
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                {currentStep === 'input' && 'Feel The Vibe'}
                {currentStep === 'loading' && 'Curating Your Perfect Playlist'}
                {currentStep === 'results' && `${songs.length} Songs Found`}
              </span>
            </h1>
            
            {/* Progress Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-lg)'
            }}>
              {['input', 'loading', 'results'].map((step, index) => (
                <div
                  key={step}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: currentStep === step || 
                      (step === 'loading' && currentStep === 'results') ||
                      (step === 'input' && (currentStep === 'loading' || currentStep === 'results'))
                      ? 'var(--neon-purple)' 
                      : 'rgba(255, 255, 255, 0.2)',
                    transition: 'var(--transition-smooth)',
                    boxShadow: currentStep === step ? '0 0 10px var(--neon-purple)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <MoodInput
            onMoodSelect={handleMoodSelect}
            onSongsFetched={handleSongsFetched}
            onError={handleError}
            isLoading={isLoading}
          />

          {/* Results Section */}
          {(songs.length > 0 || isLoading) && (
            <>
              <hr className="divider" />
              
              {/* Reset Button */}
              {currentStep === 'results' && (
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                  <button
                    onClick={resetToInput}
                    style={{
                      background: 'transparent',
                      border: '2px solid var(--neon-purple)',
                      borderRadius: 'var(--border-radius)',
                      color: 'var(--neon-purple)',
                      padding: 'var(--spacing-sm) var(--spacing-lg)',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--neon-purple)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--neon-purple)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    🔄 Try New Mood
                  </button>
                </div>
              )}

              <SongSuggestions songs={isLoading ? null : songs} mood={mood} />
            </>
          )}

          {/* Footer Credits */}
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--spacing-2xl)',
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-ultra-muted)',
            fontSize: '0.8rem'
          }}>
            <p style={{ margin: 0 }}>
              Powered by AI 🤖 • Spotify Integration 🎧 • Built with ❤️
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
