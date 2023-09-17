import React, { useState } from 'react';
import './FileUploader.css';
import { getDocument } from 'pdfjs-dist/webpack';

const FileUploader = ({ onProcessingComplete }) =>
{
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type to use correct file reader
            if (file.name.split(".")[1] === "pdf"){
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const buffer = e.target.result;
                    const arr = new Uint8Array(buffer);

                    try {
                        const pdfFile = await getDocument(arr).promise; // Get pdf file
                        let text = '';

                        for (let i = 1; i <= pdfFile.numPages; i++) { // Read all pages
                            const page = await pdfFile.getPage(i);
                            const textContent = await page.getTextContent(); // Extract raw text from pdf file
                            const pageText = textContent.items.map((item) => item.str).join(' ');
                            text += pageText + '\n';
                        }

                        setUploadedFile(text);
                        setFilename(file.name);
                    } catch (error) {
                        console.error('Error reading PDF:', error);
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {

            }
        }
    }

    const handleFileProcessing = () =>
    {
        // Process the file (just outputting raw input for now)
        const results = [uploadedFile];
        onProcessingComplete(filename, results);
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