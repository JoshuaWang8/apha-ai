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
        const results = [{ title: '', content: processedText }];

        const keywords = findKeywords(processedText);
        onVoiceInput("voice input", results, keywords);
    }

    function findKeywords(inputText) {
        // Tokenize the text into terms (words or phrases)
        const terms = inputText.split(/\s+/);

        // Calculate Term Frequency (TF) for each term
        const termFrequency = {};
        terms.forEach(term => {
            termFrequency[term] = (termFrequency[term] || 0) + 1;
        });

        // Calculate Inverse Document Frequency (IDF)
        const inverseDocumentFrequency = {};
        terms.forEach(term => {
            inverseDocumentFrequency[term] = Math.log(terms.length / (terms.filter(element => element === term).length + 1));
        });

        // Calculate TF-IDF score for each term
        const keywords = Object.keys(termFrequency).map(term => ({
            term,
            tfidf: termFrequency[term] * inverseDocumentFrequency[term],
        }));

        // Sort keywords by TF-IDF score
        keywords.sort((a, b) => b.tfidf - a.tfidf);

        // Get keywords based on the threshold
        const stopwords = [
            "a", "an", "and", "the", "in", "of", "on", "at", "for", "to", "with", "by", "as", "but", "or", "not", "is", "it", "he",
            "she", "you", "I", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their",
            "all", "any", "some", "many", "few", "more", "most", "much", "no", "none", "nor", "every", "each", "either", "neither",
            "both", "such", "what", "which", "who", "whom", "whose", "why", "how", "where", "when", "wherever", "whenever",
            "whether", "while", "before", "after", "during", "since", "until", "because", "although", "if", "unless", "since",
            "while", "so", "be", "can", "us", "also", "through", "was", "had", "were", "about", "here", "are", "has"
        ];

        let keywordCount = 0;
        let i = 0;
        const keywordsToHighlight = [];

        while (keywordCount < (keywords.length) * 10 / 100) {
            if (!stopwords.includes(keywords[i]['term'])) {
                keywordsToHighlight.push(keywords[i]['term']);
                keywordCount++;
            }
            i++;
        }
        return keywordsToHighlight;
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
                    {listening ? 'Stop Listening' : 'Voice Assistance'} <MdSettingsVoice />
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
