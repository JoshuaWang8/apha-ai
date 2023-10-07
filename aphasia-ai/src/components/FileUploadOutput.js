import React, { useState, useEffect } from 'react';
import './FileUploadOutput.css'

export const FileUploadOutput = ({ filename, results, isVisible }) => {
    const [readResults, setReadResults] = useState(false);

    const resetSpeech = () => {
        speechSynthesis.cancel();
        setReadResults(false);
    }

    const pauseSpeech = () => {
        speechSynthesis.pause();
        setReadResults(false);
    }

    const resumeSpeech = () => {
        speechSynthesis.resume();
        setReadResults(true);
    }

    const startSpeech = () => {
        const resultsText = results.join('. '); // Combine results into a single string
        const utterance = new SpeechSynthesisUtterance(`File results for ${filename}: ${resultsText}`);
        utterance.rate = 0.75;

        setReadResults(true);
        speechSynthesis.speak(utterance);
    }

    return (
        <div className={`file-output-blob ${isVisible ? 'visible' : ''}`}>
            <button aria-label="Read results" className="sr-only" onClick={startSpeech}> Read Results </button>
            <button onClick={resumeSpeech}>Unpause</button>
            <button onClick={pauseSpeech}>Pause</button>
            <button onClick={resetSpeech}>Reset</button>

            {isVisible &&
                <div>
                    <p>File results for: {filename}</p>
                    <ul>
                        {results.map((result, index) => (                                               
                            <li key={index}>
                                {result}
                            </li>
                        ))}       
                    </ul>                                     
                </div>
            }
        </div>
    )
}