// src/App.js
import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';  
import MoodInput from './components/MoodInput';
import SongSuggestions from './components/SongSuggestions';
import 'bootstrap/dist/css/bootstrap.min.css';
import bgImage from './assets/background.jpg'; // Import your background image if needed

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
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1rem',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#e0e0e0',
  position: 'relative',
}}>

      <Container fluid className="d-flex justify-content-center">
        <Card
  style={{
    width: '100%',
    maxWidth: '750px',
    padding: '3rem 2rem 3.5rem',
    borderRadius: '25px',
    background: 'linear-gradient(145deg, rgba(0,0,0,0.6), rgba(60,0,90,0.4))',
    boxShadow: '0 12px 40px rgba(140, 0, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#f0f0f0',
    transition: 'all 0.3s ease-in-out',
  }}
>

          <h1 style={{
            fontWeight: '800',
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '2.5rem',
            letterSpacing: '0.1em',
            textShadow: '0 0 10px #6c63ff',
          }}>
            🎵 MusicAI: Feel The Vibe
          </h1>

          <MoodInput
            onMoodSelect={handleMoodSelect}
            onSongsFetched={handleSongsFetched}
          />

          <hr style={{
            borderColor: 'rgba(255, 255, 255, 0.15)',
            margin: '3rem 0',
          }}/>

          <SongSuggestions songs={songs} />
        </Card>
      </Container>
    </div>
  );
}

export default App;

