import React from 'react';
import Logo from '../assets/apha-ai-logo.png';
import "./LoadingScreen.css";

export const LoadingScreen = () => {
    return (
        <>
            <div class="container">
                <span class="apha-logo" />
            </div>

            <p class="title">Welcome to apha.ai</p>
        </>
    );
}