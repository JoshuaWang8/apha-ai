import React, { useState } from 'react';
import './FileUploadOutput.css'

export const FileUploadOutput = ({ filename, results, isVisible }) => {
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
            const utterance = new SpeechSynthesisUtterance(`File results for ${filename}: ${resultsText}`);
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
                    {results.map((result, index) => (
                        <p key={index}>
                            {result}
                        </p>
                    ))}
                </div>
            }
        </div>
    )
}