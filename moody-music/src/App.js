// src/App.js
import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';  
import MoodInput from './components/MoodInput';
import SongSuggestions from './components/SongSuggestions';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [, setMood] = useState('');
  const [songs, setSongs] = useState([]);

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleSongsFetched = (fetchedSongs) => {
    setSongs(fetchedSongs);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #fceabb, #f8b500)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Container fluid className="d-flex justify-content-center">
        <Card style={{
          width: '100%',
          maxWidth: '600px',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 0 30px rgba(0,0,0,0.1)',
          backgroundColor: '#ffffffdd',
          backdropFilter: 'blur(5px)'
        }}>
          <h1 className="text-center mb-4" style={{ fontWeight: '800', color: '#8b5cf6' }}>
            🎵 Moodify: Feel The Vibe
          </h1>
          <MoodInput
            onMoodSelect={handleMoodSelect}
            onSongsFetched={handleSongsFetched}
          />
          <hr />
          <SongSuggestions songs={songs} />
        </Card>
      </Container>
    </div>
  );
}

export default App;
