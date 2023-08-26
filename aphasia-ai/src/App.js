import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResultOutput } from './components/SearchResultOutput';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import Logo from './assets/apha-ai-logo.png';

function App()
{
    // const [searchComplete, setSearchComplete] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [searchResults, setSearchResults] = useState([]);
    const [blobVisible, setBlobVisible] = useState(false);
    const [fileResults, setFileResults] = useState([]);
    const [filename, setFilename] = useState('');

    // const handleSearch = (searchTerm) =>
    // {
    //     setSearchTerm(searchTerm);
    //     setSearchResults([]); // clear previous search results            
    // }

    // const handleSearchComplete = (results) =>
    // {
    //     setSearchResults(results);
    //     setBlobVisible(results.length !== 0 ? true : false);
    // }

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
                {/* <SearchBar onSearch={handleSearch} onSearchComplete={handleSearchComplete} />
                <SearchResultOutput searchTerm={searchTerm} results={searchResults} isVisible={blobVisible} /> */}
                <FileUploader onProcessingComplete={handleProcessingComplete}/>
                <FileUploadOutput filename={filename} results={fileResults} isVisible={blobVisible}/>
            </header>
        </div>
    );
}

export default App;
