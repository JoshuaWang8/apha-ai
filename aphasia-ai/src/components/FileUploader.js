import React, { useState } from 'react';
import './FileUploader.css';
import { getDocument } from 'pdfjs-dist/webpack';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const FileUploader = ({ onProcessingComplete }) =>
{
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');

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
                    setUploadedFile(text);
                }
            }
            setFilename(file.name);
            reader.readAsArrayBuffer(file);
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