import React, { useState } from 'react';
import './FileUploader.css';
import { getDocument } from 'pdfjs-dist/webpack';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const FileUploader = ({ onProcessingComplete }) =>
{
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const [keywords, setKeywords] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                const arr = new Uint8Array(buffer);
                const fileNameSplit = file.name.split("."); // For getting file type

                // Check file type to use correct file reader
                if (fileNameSplit[fileNameSplit.length - 1] === "pdf"){
                    try {
                        const pdfFile = await getDocument(arr).promise; // Get pdf file
                        let text = '';

                        for (let i = 1; i <= pdfFile.numPages; i++) { // Read all pages
                            const page = await pdfFile.getPage(i);
                            const textContent = await page.getTextContent(); // Extract raw text from pdf file
                            const pageText = textContent.items.map((item) => item.str).join(' ');
                            text += pageText + '\n';
                        }
                        setUploadedFile(text); // Set extracted text
                        
                    } catch (error) {
                        console.error('Error reading PDF:', error);
                    }
                } else { // If docx file
                    const zip = new PizZip(reader.result); // Zip file
                    const docFile = new Docxtemplater().loadZip(zip); // Load zipped docx file
                    const text = docFile.getFullText(); // Extract text
                    const formattedText = text.replace(/([.!?])(?!\d)/g, "$1 "); // Add spaces since reader squashes all sentences together
                    setUploadedFile(formattedText);
                }
            }
            setFilename(file.name);
            reader.readAsArrayBuffer(file);
        }
    }

    async function handleFileProcessing()
    {
        // Split the text into sentences
        const textChunks = uploadedFile.split(/[.!?]+\s/).filter(Boolean);
        const chunkSize = 25; // Set chunk size
        const processedChunks = [];

        for (let i = 0; i < textChunks.length; i += chunkSize) {
            const chunk = textChunks.slice(i, i + chunkSize).join(' ');
            try {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/VCInit/autotrain-aphasia-simplification-92527144747",
                    {
                        headers: { Authorization: "Bearer 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" },
                        method: "POST",
                        body: JSON.stringify({
                            "inputs": chunk
                        }),
                    }
                );

                const result = await response.json();
                processedChunks.push(result[0].summary_text);
            } catch (error) {
                console.error('Error processing chunk:', error);
            }
        }

        // Join the processed chunks
        const processedText = processedChunks.join(' ');
        const results = [processedText];
        // Find keywords if it shows up in 2% of the document
        findKeywords(processedText, Math.ceil((2 / 100) * processedText.split(/\s+/).length));
        onProcessingComplete(filename, results, keywords);
    }

    function findKeywords(inputText, threshold) {
        // Preprocess text
        const text = inputText
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .split(' ');
      
        // Mapping of words to frequencies
        const wordFrequency = {};
        text.forEach( word => {
            if (word in wordFrequency) {
                wordFrequency[word]++;
            } else {
                wordFrequency[word] = 1;
            }
        });
      
        // Get keywords based on the threshold
        const stopwords = [
            "a", "an", "and", "the", "in", "of", "on", "at", "for", "to", "with", "by", "as", "but", "or", "not", "is", "it", "he",
            "she", "you", "I", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their",
            "all", "any", "some", "many", "few", "more", "most", "much", "no", "none", "nor", "every", "each", "either", "neither",
            "both", "such", "what", "which", "who", "whom", "whose", "why", "how", "where", "when", "wherever", "whenever",
            "whether", "while", "before", "after", "during", "since", "until", "because", "although", "if", "unless", "since",
            "while", "so", "be", "can", "us", "also", "through", "was", "had"
        ];
          
        const keywords = [];
        for (const word in wordFrequency) {
            if ((wordFrequency[word] >= threshold) && !(stopwords.includes(word))) {
                keywords.push(word);
            }
        }
      
        setKeywords(keywords);
    }

    return (
        <div>
            <div className='file-uploader-container'>
                    <label htmlFor='file-input' className='file-input-label'>
                        <div> Click to Upload </div>
                        <input type="file" accept=".pdf, .docx" onChange={handleFileUpload} />
                    </label>
                </div>
            <button onClick={handleFileProcessing}> Process File </button>
        </div>
    );
};

export default FileUploader;