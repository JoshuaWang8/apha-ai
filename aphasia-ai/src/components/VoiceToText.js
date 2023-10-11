import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
    const Sta = () => SpeechRecognition.startListening({ continuous: true })
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <p1>Microphone: {listening ? 'on' : 'off'}</p1>
            <button1 onClick={Sta}>Start</button1>
            <button2 onClick={SpeechRecognition.stopListening}>Stop</button2>
            <button3 onClick={resetTranscript}>Reset</button3>
            <p>{transcript}</p>
        </div>
    );
};

export default Dictaphone;
