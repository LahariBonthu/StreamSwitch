import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import '../component-styles/about-page-styles.css';

function LoadAbout() {
    useEffect(() => {
        document.title = 'About | StreamSwitch';

        let spotify_access_token = localStorage.getItem('spotify_access_token'); 
        if (spotify_access_token) {
            setIsLoggedIn(true);
        }
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div id="about-container" className="container">
            <Navbar isLoggedIn={isLoggedIn} />

            <div id="about-content">
                <div id="about-wrapper">
                    <div id="data">
                        <h1>What is StreamSwitch?</h1>
                        <p>
                            <span>StreamSwitch is an application that makes it easy to move your playlists from Spotify to YouTube Music.</span>
                            <span>Out of the frustration with Tune My Music’s limit of 200 songs per transfer, I created this application.</span>
                            <span>As someone who loves music and often switches between platforms, </span>
                            <span>I wanted something that worked better for people like me—and that’s how StreamSwitch was born.</span>
                        </p>

                        <h1>Contact Me</h1>
                        <div id="contact">
                            <a name="Github" href="https://github.com/LahariBonthu"><i className="fa-brands fa-github"></i></a>
                            <a name="Linkedin" href="https://www.linkedin.com/in/bonthusailahari/"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a name="Mail" href="mailto:laharibonthu1882@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadAbout;
