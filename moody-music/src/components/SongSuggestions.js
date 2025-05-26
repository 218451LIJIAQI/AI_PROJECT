// src/components/SongSuggestions.js
import React from 'react';
import { Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';

/**
 * SongSuggestions Component
 * Displays a responsive grid of song suggestion cards with loading and empty states.
 * Props:
 * - songs: Array of song objects or null when loading.
 *   Each song object should have: id, title, artist, albumImageUrl, url.
 */

const SongSuggestions = ({ songs }) => {
  // Loading state
  if (songs === null) {
    return (
      <div className="d-flex flex-column align-items-center my-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3 text-muted">Loading your vibe...</p>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <Alert variant="warning" className="text-center my-5">
        Oops! No songs found for this mood.
      </Alert>
    );
  }

  // Display songs in a responsive grid
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-4">
      {songs.map((song) => (
        <Col key={song.id} className="d-flex">
          <Card className="flex-fill shadow-lg rounded-4 transition-transform hover-pop">
            {song.albumImageUrl && (
              <Card.Img
                variant="top"
                src={song.albumImageUrl}
                alt={`${song.title} album cover`}
                style={{
                  height: '180px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '0.75rem',
                  borderTopRightRadius: '0.75rem'
                }}
              />
            )}
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-2 text-truncate" title={song.title}>
                {song.title}
              </Card.Title>
              <Card.Text className="text-muted text-truncate mb-3" title={song.artist}>
                {song.artist}
              </Card.Text>
              <div className="mt-auto">
                <Button
                  variant="success"
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-100 fw-semibold"
                >
                  Listen on Spotify
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SongSuggestions;
