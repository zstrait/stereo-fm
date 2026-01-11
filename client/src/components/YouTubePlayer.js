import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function YouTubePlayer({ videoId }) {
    const [playerError, setPlayerError] = useState(false);

    useEffect(() => {
        setPlayerError(false);
    }, [videoId]);

    const getCleanVideoId = (rawInput) => {
        if (!rawInput) return null;
        if (rawInput.length === 11) return rawInput;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = rawInput.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        }
        return null;
    };

    const cleanVideoId = getCleanVideoId(videoId);

    const opts = {
        height: '219px',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const onPlayerError = (event) => {
        console.warn("YouTube Player Error:", event.data);
        setPlayerError(true);
    }

    if (!videoId) {
        return (
            <div style={placeholderStyle}>
                (Select a Song to Play)
            </div>
        );
    }

    if (!cleanVideoId) {
        return (
            <div style={placeholderStyle}>
                <span style={{ color: 'red', fontWeight: 'bold' }}>Invalid Video Link</span>
                <span style={{ fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
                    The link provided for this song is invalid.
                </span>
            </div>
        );
    }

    if (playerError) {
        return (
            <div style={placeholderStyle}>
                <span style={{ color: 'red', fontWeight: 'bold' }}>Video Unavailable</span>
                <span style={{ fontSize: '12px', marginTop: '10px' }}>(Private or Deleted Video)</span>
            </div>
        );
    }

    return (
        <div style={playerContainerStyle}>
            <YouTube
                key={cleanVideoId}
                videoId={cleanVideoId}
                opts={opts}
                onError={onPlayerError}
            />
        </div>
    );
}

const playerContainerStyle = {
    width: '100%',
    height: '219px',
    borderRadius: '16px',
    overflow: 'hidden',
};

const placeholderStyle = {
    width: '100%',
    height: '219px',
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    borderRadius: '16px',
};