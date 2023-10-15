import React, { useState,useEffect } from 'react';
import './FileUploadOutput.css';
import '../App.css';
import Axios from "axios";
import Popup from "./PopUp";

export const FileUploadOutput = ({ filename, results, isVisible, keywords }) => {
    const [readResults, setReadResults] = useState(false);
    const [newSpeech, setNewSpeech] = useState(true);
    const [data, setData] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

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

    const formatResults = (results, keywords) => {
        const contentSentences = results['content'].split(/(?<=[.])/g);
        console.log(contentSentences);
        return (
            <div>
                <h3>{results['title']}</h3>
                <ul>
                    {contentSentences.map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                    ))}
                </ul>
            </div>
        );
        // const words = results['content'].split(/\s+/); // Split the text into words

        // // Check if a word is a keyword
        // const isKeyword = word => keywords.includes(word.toLowerCase());

        // // Highlight words
        // return words.map((word, index) => (
        //     isKeyword(word) ? <span><span key={index} className="highlighted">{word}</span> <span>{' '}</span></span> : word + ' '
        // ));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (selectedWord && contextMenuVisible) {
                try {
                    const response = await Axios.get(
                        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${selectedWord.toLowerCase()}`
                    );
                    setData(response.data[0]);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [selectedWord, contextMenuVisible]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        const selectedText = window.getSelection().toString();
        const fileOutputBlob = document.querySelector(".file-output-blob");
    
        if (selectedText && fileOutputBlob) {
            const boundingBox = fileOutputBlob.getBoundingClientRect();
            const verticalDistance = e.clientY - boundingBox.top;
            const horizontalDistance = e.clientX - boundingBox.left;
            setSelectedWord(selectedText);
            setContextMenuPosition({ x: horizontalDistance, y: verticalDistance });
            setContextMenuVisible(true);
        } else {
            setContextMenuVisible(false);
        }
    };

    const handleClosePopup = () => {
        setContextMenuVisible(false);
    };

    // Add a click event listener to the document to close the popup when clicking outside
    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (contextMenuVisible) {
                const popupElement = document.querySelector(".popup");
                if (popupElement && !popupElement.contains(e.target)) {
                    handleClosePopup();
                }
            }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [contextMenuVisible]);

    return (
        <div className={`file-output-blob ${isVisible ? 'visible' : ''}`} onContextMenu={handleContextMenu}>
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
                                {formatResults(result, keywords)}
                            </li>
                        ))}
                    </ul>
                </div>
            }
                        {contextMenuVisible && (
                <Popup data={data} position={contextMenuPosition} />
            )}
        </div>
    )
}