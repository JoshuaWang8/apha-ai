import React, { useEffect, useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import { LoadingScreen } from './components/LoadingScreen';
import Logo from './assets/apha-ai-logo.png';

function App() {
    const [blobVisible, setBlobVisible] = useState(false);
    const [fileResults, setFileResults] = useState([]);
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {

        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    const handleProcessingComplete = (filename, results, keywords) => {
        setFileResults(results);
        setFilename(filename);
        setBlobVisible(results.length !== 0 ? true : false);
        setKeywords(keywords);
    }

    return (
        <div className="App">
            {isLoading ? (
                <div className='LoadingScreen'>
                    <LoadingScreen />
                </div>
            ) : (
                <header className="App-header">
                    <img src={Logo} alt="Logo" className="App-logo" width='400' style={{ padding: '40px' }} />
                    <FileUploader onProcessingComplete={handleProcessingComplete} />
                    <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible} keywords={keywords}/>
                </header>
            )}
        </div>
    );
}

export default App;
