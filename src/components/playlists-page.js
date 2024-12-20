import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../component-styles/playlists-page-styles.css";
import GoogleAuth from "../helpers/google-login";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "https://streamswitch.vercel.app/playlists";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function next(playlists, currentIndex, setCurrentIndex) {
    if (playlists.length === 0) return; // Prevent errors when playlists is empty
    const newIndex = (currentIndex + 1) % playlists.length;
    setCurrentIndex(newIndex);
}

function previous(playlists, currentIndex, setCurrentIndex) {
    if (playlists.length === 0) return; // Prevent errors when playlists is empty
    const newIndex = (currentIndex - 1 + playlists.length) % playlists.length;
    setCurrentIndex(newIndex);
}

function LoadPlaylists() {
    useEffect(() => {
        document.title = "Playlists | StreamSwitch";
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const { login } = GoogleAuth({
        onAuthSuccess: () => {
            setIsAuthenticated(true);
            handleConvert();
        },
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        const spotifyAccessToken = localStorage.getItem("spotify_access_token");

        if (spotifyAccessToken) {
            (async () => {
                try {
                    const playlistsResponse = await axios.get(
                        "https://api.spotify.com/v1/me/playlists",
                        {
                            headers: {
                                Authorization: `Bearer ${spotifyAccessToken}`,
                            },
                        }
                    );

                    setIsLoggedIn(true);
                    setPlaylists(playlistsResponse.data.items || []);
                } catch (error) {
                    console.error("Failed to fetch playlists:", error);
                }
            })();
        }

        if (code) {
            (async () => {
                try {
                    const tokenResponse = await axios.post(
                        TOKEN_URL,
                        new URLSearchParams({
                            grant_type: "authorization_code",
                            code: code,
                            redirect_uri: REDIRECT_URI,
                            client_id: CLIENT_ID,
                            client_secret:
                                process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
                        }),
                        {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        }
                    );

                    const accessToken = tokenResponse.data.access_token;
                    window.localStorage.setItem(
                        "spotify_access_token",
                        accessToken
                    );

                    const playlistsResponse = await axios.get(
                        "https://api.spotify.com/v1/me/playlists",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    setIsLoggedIn(true);
                    setPlaylists(playlistsResponse.data.items || []);
                } catch (error) {
                    console.error("Failed to authenticate or fetch playlists:", error);
                }
            })();
        }
    }, []);

    const handleConvert = () => {
        const selectedPlaylist = playlists[currentIndex];
        if (selectedPlaylist) {
            navigate("/songs", { state: { playlist: selectedPlaylist } });
        }
    };

    return (
        <div id="playlists-container" className="container">
            <Navbar isLoggedIn={isLoggedIn} />

            <div id="playlists-wrapper">
                <div id="playlist-module">
                    <h2>Switching Starts</h2>
                    {playlists.length > 0 ? (
                        <select
                            id="playlists"
                            value={playlists[currentIndex]?.id || ""}
                            onChange={(e) =>
                                setCurrentIndex(
                                    playlists.findIndex((pl) => pl.id === e.target.value)
                                )
                            }
                        >
                            {playlists
                                .filter((playlist) => playlist != null) // Ensure playlists are valid
                                .map((playlist, index) => (
                                    <option key={playlist.id} value={playlist.id}>
                                        {playlist.name}
                                    </option>
                                ))}
                        </select>
                    ) : (
                        <p>No playlists available.</p>
                    )}

                    <div id="button-row">
                        <button
                            onClick={() => previous(playlists, currentIndex, setCurrentIndex)}
                            className="material-symbols-outlined"
                        >
                            skip_previous
                        </button>
                        <button onClick={login}>Convert</button>
                        <button
                            onClick={() => next(playlists, currentIndex, setCurrentIndex)}
                            className="material-symbols-outlined"
                        >
                            skip_next
                        </button>
                    </div>

                    <p>
                        Choose a playlist to convert to Youtube music. The playlist in the
                        title will be selected. Use the nav buttons (Previous, Next) or
                        choose from the dropdown.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoadPlaylists;