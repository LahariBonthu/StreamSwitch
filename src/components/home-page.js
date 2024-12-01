import React, { useEffect } from 'react';
import '../component-styles/home-page-styles.css';
import Navbar from './navbar';

// Authentication function for Spotify
function authenticate() {
   
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = 'https://streamswitch.vercel.app/playlists';
    const AUTH_URL = 'https://accounts.spotify.com/authorize';
    const SCOPES = 'user-read-private user-read-email playlist-read-private';
    const authUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
}


function LoadHome() {
    useEffect(() => {
        document.title = 'StreamSwitch';
    }, []);

    return (
        <div id='home-container' className='container'>
            <Navbar />

            {/* Images in the corners */}
            <div className="top-left-image"></div>
            <div className="bottom-left-image"></div>
            <div className="bottom-right-image"></div>

            {/* Floating musical note */}
            <div id="music-note">🎵</div>

            {/* Main Content */}
            <div id='content'>
                <h1>StreamSwitch</h1>
                <div>
                    <p>Because, Spotify has lost its groove and is now playing a tuneless melody!</p>
                    <p>
                        Use Switchify to copy your playlist from Spotify to Youtube Music.
                        And start grooving again. (Ps: Youtube has almost all tracks)
                    </p>
                </div>
                <button onClick={authenticate} id='switch'>Switch to Youtube Music</button>
            </div>
        </div>
    );
}

export default LoadHome;
