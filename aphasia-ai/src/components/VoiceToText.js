import './VoiceToText.css'
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const Sta = () => SpeechRecognition.startListening({ continuous: true });
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
    <div className="voiceContainer">
      <div className="search-box">
        <button className="btn-search" onClick={listening ? SpeechRecognition.stopListening : Sta}></button>
        <input
          type="text"
          className={`input-search ${transcript ? 'expanded' : ''}`}
          value={transcript} // Use transcript as the initial value
          onChange={(e) => SpeechRecognition.abortListening()} // Disable speech recognition while editing
        />
        <p>Microphone: {listening ? 'on' : 'off'}
        <button className="button-reset" onClick={resetTranscript}>RESET</button>
        </p>
      </div>
    </div>
  );
}

export default Dictaphone;
