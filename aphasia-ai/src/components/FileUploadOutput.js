import React, { useState } from 'react';
import './FileUploadOutput.css'

export const FileUploadOutput = ({ filename, results, isVisible, keywords }) => {
    const [readResults, setReadResults] = useState(false);
    const [newSpeech, setNewSpeech] = useState(true);

    const resetSpeech = () => {
        speechSynthesis.cancel();
        setReadResults(false);
        setNewSpeech(true);
    }

    const pauseSpeech = () => {
        speechSynthesis.pause();
        setReadResults(false);
    }

    const startSpeech = (newSpeech) => {
        if (newSpeech) {
            const resultsText = results.join('. '); // Combine results into a single string
            const utterance = new SpeechSynthesisUtterance(`Summarisation for ${filename}: ${resultsText}`);
            utterance.rate = 0.75;

            speechSynthesis.speak(utterance);
            setReadResults(true);
            setNewSpeech(false);
        }
        else {
            speechSynthesis.resume();
            setReadResults(true);
        }
    }

    const highlightKeywords = (results, keywords) => {
        const words = results.split(/\s+/); // Split the text into words

        // Check if a word is a keyword
        const isKeyword = word => keywords.includes(word.toLowerCase());

        // Highlight words
        return words.map((word, index) => (
            isKeyword(word) ? <span><span key={index} className="highlighted">{word}</span> <span>{' '}</span></span> : word + ' '
        ));
    };

    return (
        <div className={`file-output-blob ${isVisible ? 'visible' : ''}`}>
            {!readResults ? (
                <>
                    {newSpeech ? (
                        <button aria-label="Read results" className="sr-only" onClick={() => startSpeech(true)}> Read Results </button>
                    ) : (
                        <button onClick={() => startSpeech(false)}> Unpause </button>
                    )}
                </>
            ) : (
                <>
                    <button onClick={pauseSpeech}>Pause</button>
                    <button onClick={resetSpeech}>Reset</button>
                </>
            )}

            {isVisible &&
                <div>
                    <p>Summarization For: {filename}</p>
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