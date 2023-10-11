import React, { useEffect, useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import { LoadingScreen } from './components/LoadingScreen';
import Logo from './assets/apha-ai-logo.png';
import { Instructions } from './components/Instructions';

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
                <header className='Loading-screen'>
                    <LoadingScreen />
                </header>
            ) : (
                <header className="App-header">
                    <img src={Logo} alt="Logo" className="App-logo" width='400' style={{ padding: '40px' }} />
                    {/* <button onClick={query}> Generate Response </button> */}
                    <Instructions />
                    <FileUploader onProcessingComplete={handleProcessingComplete} />
                    <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible} keywords={keywords} />
                    <footer>
                        <p>
                            Disclaimer: This app provides information through translations for informational purposes only. Please be aware that the data used to train the model may contain biases. Use discretion and verify critical information independently. We do not guarantee accuracy or impartiality.
                        </p>
                    </footer>
                </header>
            )}

        </div>
    );
}

export default App;
