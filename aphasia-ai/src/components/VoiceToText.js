import './VoiceToText.css'
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdSettingsVoice, MdOutlineSummarize } from 'react-icons/md';
import { GrPowerReset } from 'react-icons/gr';

const VoiceToText = ({ onVoiceInput }) => {
    const Start = () => SpeechRecognition.startListening({ continuous: true });

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    async function handleVoiceProcessing() {
        // Split the text into sentences
        const textChunks = transcript.split(/[.!?]+\s/).filter(Boolean);
        const chunkSize = 25; // Set chunk size
        const processedChunks = [];

        for (let i = 0; i < textChunks.length; i += chunkSize) {
            const chunk = textChunks.slice(i, i + chunkSize).join(' ');
            try {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/VCInit/autotrain-aphasia-simplification-92527144747",
                    {
                        headers: { Authorization: "Bearer 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" },
                        method: "POST",
                        body: JSON.stringify({
                            "inputs": chunk
                        }),
                    }
                );

                const result = await response.json();
                processedChunks.push(result[0].summary_text);
            } catch (error) {
                console.error('Error processing chunk:', error);
            }
        }

        // Join the processed chunks
        const processedText = processedChunks.join(' ');
        const results = [processedText];
        // Find keywords if it shows up in 2% of the document

        // findKeywords(processedText, Math.ceil((2 / 100) * processedText.split(/\s+/).length));
        onVoiceInput("voice input", results, []);
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function handleVoiceReset() {
        onVoiceInput('', [], []);
        resetTranscript();
    }

    return (
        <div className="voice-input-container">
            <div className="input-actions">
                <button className="listen-action" onClick={listening ? SpeechRecognition.stopListening : Start}>
                    {listening ? 'Stop Listening' : 'Start Listening'} <MdSettingsVoice />
                </button>

                {listening &&
                    <>
                        <input
                            type="text"
                            className={`input-search ${transcript ? 'expanded' : ''}`}
                            value={transcript} // Use transcript as the initial value
                            onChange={(e) => SpeechRecognition.abortListening()} // Disable speech recognition while editing
                        />
                    </>}

                {transcript &&
                    <>
                        <button className='reset-action' onClick={handleVoiceReset}> Reset Input <GrPowerReset /> </button>
                        <button className='process-action' onClick={handleVoiceProcessing}> Process Input <MdOutlineSummarize /> </button>
                    </>
                }
            </div>
        </div>
    );
}

export default VoiceToText;
