import React, { useState, useEffect } from 'react';
import './FileUploadOutput.css'

export const FileUploadOutput = ({ filename, results, isVisible, keywords }) => {
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

    const highlightKeywords = (results, keywords) => {
        const words = results.split(/\s+/); // Split the text into words

        // Check if a word is a keyword
        const isKeyword = word => keywords.includes(word.toLowerCase());
    
        // Highlight words
        return words.map((word, index) => (
            isKeyword(word) ? <span><span key={index} className="highlighted">{word}</span> <span>{' '}</span></span>: word + ' '
        ));
    };

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
                                {highlightKeywords(result, keywords)}
                            </li>
                        ))}       
                    </ul>                                     
                </div>
            }
        </div>
    )
}