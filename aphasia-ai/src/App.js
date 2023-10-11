import React, { useEffect, useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import { FileUploadOutput } from './components/FileUploadOutput';
import { LoadingScreen } from './components/LoadingScreen';
import Logo from './assets/apha-ai-logo.png';
import Axios from "axios";
import Popup from "./components/PopUp";

function App() {
    const [blobVisible, setBlobVisible] = useState(false);
    const [fileResults, setFileResults] = useState([]);
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [keywords, setKeywords] = useState([]);
    const [data, setData] = useState(null);
    const [selectedWord, setSelectedWord] = useState("");
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
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

    useEffect(() => {
      const fetchData = async () => {
        if (selectedWord && contextMenuVisible) {
          try {
            const response = await Axios.get(
              `https://api.dictionaryapi.dev/api/v2/entries/en_US/${selectedWord.toLowerCase()}`
            );
            setData(response.data[0]);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      };
  
      fetchData();
    }, [selectedWord, contextMenuVisible]);
  
    const handleContextMenu = (e) => {
      e.preventDefault();
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        setSelectedWord(selectedText);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
      } else {
        setContextMenuVisible(false);
      }
    };
  
    const handleClosePopup = () => {
      setContextMenuVisible(false);
    };
  
    // Add a click event listener to the document to close the popup when clicking outside
    useEffect(() => {
      const handleDocumentClick = (e) => {
        if (contextMenuVisible) {
          const popupElement = document.querySelector(".popup");
          if (popupElement && !popupElement.contains(e.target)) {
            handleClosePopup();
          }
        }
      };
  
      document.addEventListener("click", handleDocumentClick);
  
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, [contextMenuVisible]);
    return (
        <div className="App" onContextMenu={handleContextMenu}>
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
                  {contextMenuVisible && (
        <Popup data={data} position={contextMenuPosition} />
        )}
        </div>
    );
}

export default App;
