import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import Logo from './assets/apha-ai-logo.png';

function App()
{
    const [blobVisible, setBlobVisible] = useState(false);
    const [fileResults, setFileResults] = useState([]);
    const [filename, setFilename] = useState('');

    const handleProcessingComplete = (filename, results) =>
    {
        setFileResults(results);
        setFilename(filename);
        setBlobVisible(results.length !== 0 ? true : false);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={Logo} alt="Logo" className="App-logo" width='400' style={{padding: '40px'}}/>
                <FileUploader onProcessingComplete={handleProcessingComplete}/>
                <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible}/>
            </header>
        </div>
    );
}

export default App;
