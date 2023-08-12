import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResultOutput } from './components/SearchResultOutput';
import './App.css';
import FileUploader from './components/FileUploader';

function App()
{
    // const [searchComplete, setSearchComplete] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [blobVisible, setBlobVisible] = useState(false);

    const handleSearch = (searchTerm) =>
    {
        setSearchTerm(searchTerm);
        setSearchResults([]); // clear previous search results            
    }

    const handleSearchComplete = (results) =>
    {
        setSearchResults(results);
        setBlobVisible(results.length !== 0 ? true : false);
    }

    const handleFileUpload = (file) =>
    {
        // Implement your logic to handle the uploaded file
        console.log('Uploaded file:', file);
    };

    return (
        <div className="App">
            <header className="App-header">
                <FileUploader onFileUpload={handleFileUpload} />
                <SearchBar onSearch={handleSearch} onSearchComplete={handleSearchComplete} />
                <SearchResultOutput searchTerm={searchTerm} results={searchResults} isVisible={blobVisible} />
            </header>
        </div>
    );
}

export default App;
