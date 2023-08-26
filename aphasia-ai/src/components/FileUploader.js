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
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                const typedArray = new Uint8Array(buffer);
    
                try {
                    const pdf = await getDocument(typedArray).promise;
                    const page = await pdf.getPage(1);
                    const textContent = await page.getTextContent();
                    const text = textContent.items.map(item => item.str).join('');
                    setUploadedFile(text);
                    setFilename(file.name);
                    console.log(filename);
                    console.log('PDF Text:', text);
                } catch (error) {
                    console.error('Error reading PDF:', error);
                }
          };
    
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