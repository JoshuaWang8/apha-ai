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

    useEffect(() => {

        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(loadingTimeout);
    }, []);

    const handleProcessingComplete = (filename, results) => {
        setFileResults(results);
        setFilename(filename);
        setBlobVisible(results.length !== 0 ? true : false);
    }

    async function query() {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/VCInit/autotrain-aphasia-simplification-92527144747",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify({ "inputs": "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct." }),
            }
        );
        const result = await response.json();
        console.log(result[0].summary_text);
        return result;
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
                    <button onClick={query}> Generate Response</button>
                    <FileUploader onProcessingComplete={handleProcessingComplete} />
                    <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible} />
                </header>
            )}
        </div>
    );
}

export default App;
