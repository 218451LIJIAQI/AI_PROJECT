// src/components/SongSuggestions.js
import React from 'react';
import { Row, Col, Alert, Container } from 'react-bootstrap';

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
      <div className="desktop-loading-container fade-in">
        <div className="loading-grid">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h3 className="loading-title">🎵 Curating Your Perfect Playlist</h3>
            <p className="loading-subtitle">
              AI is analyzing millions of tracks to find songs that perfectly match your vibe...
            </p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div className="desktop-empty-state fade-in">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="empty-state-content">
                <div className="empty-icon">🎭</div>
                <h3 className="empty-title">No Vibes Found</h3>
                <p className="empty-description">
                  We couldn't find songs matching this mood. This might be because:
                </p>
                <ul className="empty-suggestions">
                  <li>The mood is too specific or uncommon</li>
                  <li>The AI couldn't parse your text description</li>
                  <li>There's a temporary issue with the music database</li>
                </ul>
                <p className="empty-hint">
                  💡 Try a different mood or use the genre selector for better results!
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Display songs in a responsive desktop grid
  return (
    <div className="desktop-song-suggestions fade-in">
      <Container fluid>
        {/* Results Header */}
        <div className="results-header">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="results-title">
                🎶 Your {mood ? `${mood.charAt(0).toUpperCase() + mood.slice(1)}` : 'Personalized'} Playlist
              </h2>
              <p className="results-subtitle">
                {songs.length} curated songs matching your energy • Perfect for any moment ✨
              </p>
              <div className="results-divider" />
            </Col>
          </Row>
        </div>

        {/* Song Grid */}
        <div className="desktop-song-grid">
          <Row xs={1} sm={2} lg={3} xl={4} xxl={5} className="g-4">
            {songs.map((song, index) => (
              <Col key={song.id} className="d-flex">
                <div 
                  className="desktop-song-card slide-in"
                  style={{ 
                    animationDelay: `${index * 0.08}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Album Cover */}
                  <div className="desktop-album-cover">
                    {song.albumImageUrl && (
                      <>
                        <img
                          src={song.albumImageUrl}
                          alt={`${song.title} album cover`}
                          className="album-image"
                        />
                        <div className="album-overlay">
                          <div className="play-button">
                            <span>🎵</span>
                          </div>
                        </div>
                        <div className="track-number">
                          #{index + 1}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Song Info */}
                  <div className="desktop-song-info">
                    <h4 className="song-title" title={song.title}>
                      {song.title}
                    </h4>
                    
                    <p className="song-artist" title={song.artist}>
                      <span className="artist-icon">🎤</span>
                      {song.artist}
                    </p>
                    
                    {/* Action Button */}
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="desktop-play-btn"
                    >
                      <span className="btn-icon">🎧</span>
                      <span className="btn-text">Listen on Spotify</span>
                      <div className="btn-shine"></div>
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Playlist Actions */}
        <div className="playlist-actions">
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="action-buttons">
                <button className="action-btn secondary">
                  📋 Export Playlist
                </button>
                <button className="action-btn primary">
                  🔄 Find More Songs
                </button>
              </div>
              <p className="playlist-stats">
                Total Duration: ~{Math.round(songs.length * 3.5)} minutes • 
                {songs.length} tracks discovered
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default SongSuggestions;
