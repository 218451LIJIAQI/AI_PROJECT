// src/components/SongSuggestions.js
import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

/**
 * SongSuggestions Component
 * Displays a responsive grid of song suggestion cards with loading and empty states.
 * Props:
 * - songs: Array of song objects or null when loading.
 *   Each song object should have: id, title, artist, albumImageUrl, url.
 */

const SongSuggestions = ({ songs, mood }) => {
  // Loading state
  if (songs === null) {
    return (
      <div className="loading-container fade-in">
        <div className="loading-spinner"></div>
        <p className="loading-text">🎵 Curating your perfect vibe...</p>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.9rem', 
          marginTop: '0.5rem' 
        }}>
          Finding songs that match your energy
        </p>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎭</div>
        <Alert variant="warning" className="alert alert-warning">
          <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            No Vibes Found
          </h5>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Couldn't find songs matching this mood. Try a different vibe or input method!
          </p>
        </Alert>
      </div>
    );
  }

  // Display songs in a responsive grid with enhanced cards
  return (
    <div className="fade-in">
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2.5rem',
        position: 'relative'
      }}>
        <h3 style={{ 
          color: 'var(--text-primary)', 
          fontWeight: 800,
          marginBottom: '0.5rem',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          background: 'linear-gradient(135deg, var(--text-primary), var(--neon-purple))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: 'none'
        }}>
          🎶 Your {mood ? `${mood.charAt(0).toUpperCase() + mood.slice(1)}` : 'Personalized'} Playlist
        </h3>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.1rem',
          margin: 0,
          fontWeight: '500'
        }}>
          {songs.length} curated songs matching your energy ✨
        </p>
        <div style={{
          margin: 'var(--spacing-lg) auto 0',
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-pink))',
          borderRadius: '2px',
          opacity: 0.7,
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
        }} />
      </div>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {songs.map((song, index) => (
          <Col key={song.id} className="d-flex">
            <div 
              className="song-card flex-fill slide-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              data-tooltip={`${song.title} by ${song.artist}`}
            >
              {song.albumImageUrl && (
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={song.albumImageUrl}
                    alt={`${song.title} album cover`}
                    className="card-img-top"
                    style={{
                      height: '220px',
                      objectFit: 'cover',
                      width: '100%'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
                    borderRadius: '20px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '700',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              )}
              
              <div className="card-body d-flex flex-column">
                <h6 
                  className="card-title"
                  style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4',
                    height: '2.8em'
                  }}
                  title={song.title}
                >
                  {song.title}
                </h6>
                
                <p 
                  className="card-text"
                  style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '1.5rem'
                  }}
                  title={song.artist}
                >
                  🎤 {song.artist}
                </p>
                
                <div className="mt-auto">
                  <a
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                    style={{ 
                      textDecoration: 'none',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
                      border: 'none',
                      borderRadius: 'var(--border-radius-sm)',
                      boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
                      transition: 'var(--transition-smooth)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 184, 148, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 184, 148, 0.3)';
                      e.target.style.background = 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))';
                    }}
                  >
                    <span style={{ fontSize: '1.1em' }}>🎧</span>
                    Listen on Spotify
                  </a>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Enhanced Playlist Summary */}
      <div style={{
        background: 'var(--glass-bg-strong)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-2xl)',
        marginTop: 'var(--spacing-3xl)',
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
          opacity: 0.6
        }} />
        
        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🎯</div>
        
        <h4 style={{
          color: 'var(--text-primary)',
          fontWeight: '700',
          fontSize: '1.3rem',
          marginBottom: 'var(--spacing-md)',
          background: 'linear-gradient(135deg, var(--text-primary), var(--neon-purple))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Your Musical Journey Awaits
        </h4>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          margin: '0 0 var(--spacing-lg) 0',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          💡 Click any song to open it in Spotify and start your musical adventure!
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          <span>🤖 AI-Powered</span>
          <span style={{ color: 'var(--neon-purple)' }}>•</span>
          <span>🎧 Spotify Integration</span>
          <span style={{ color: 'var(--neon-purple)' }}>•</span>
          <span>✨ Mood-Based Curation</span>
        </div>
      </div>
    </div>
  );
};

export default SongSuggestions;
