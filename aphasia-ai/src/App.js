import React, { useEffect, useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import { LoadingScreen } from './components/LoadingScreen';
import Logo from './assets/apha-ai-logo.png';
import { Template } from './components/Template';
import VoiceToText from './components/VoiceToText';

function App() {
    const [blobVisible, setBlobVisible] = useState(false);
    const [fileResults, setFileResults] = useState([]);
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {

        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    const handleProcessingComplete = (filename, results, keywords) => {
        setFileResults(results);
        setFilename(filename);
        setBlobVisible(results.length !== 0 ? true : false);
        setKeywords(keywords);
    }
    return (
        <Template>
            <div className="App">
                {isLoading ? (
                    <div className='Loading-screen'>
                        <LoadingScreen />
                    </div>
                ) : (
                    <div className="App-header">
                        <img src={Logo} alt="Logo" className="App-logo" width='400' style={{ padding: '40px' }} />
                        <FileUploader onProcessingComplete={handleProcessingComplete} />
                        <span> or </span>
                        <VoiceToText onVoiceInput={handleProcessingComplete} />
                        <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible} keywords={keywords} />
                    </div>
                )}
            </div>
        </Template>
    );
}

export default App;
