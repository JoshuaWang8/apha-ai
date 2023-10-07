import React, { useState } from 'react';
import { useRef } from 'react';
import { getDocument } from 'pdfjs-dist/webpack';
import { MdOutlineFileUpload, MdOutlineSummarize } from 'react-icons/md';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import './FileUploader.css';

const FileUploader = ({ onProcessingComplete }) => {
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const hiddenFileInput = useRef(null);

    const handleFileUploadClick = event => {
        hiddenFileInput.current.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                const arr = new Uint8Array(buffer);
                const fileNameSplit = file.name.split("."); // For getting file type

                // Check file type to use correct file reader
                if (fileNameSplit[fileNameSplit.length - 1] === "pdf") {
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

    const handleFileProcessing = () => {
        // Process the file (just outputting raw input for now)
        const results = [uploadedFile];
        onProcessingComplete(filename, results);
    }

    return (
        <div className='uploader-and-processer'>
            <div className='file-upload'>
                <button className="button-upload" onClick={handleFileUploadClick}>
                    Upload File <MdOutlineFileUpload />
                </button>
                <input
                    type="file"
                    accept=".pdf, .docx"
                    onChange={handleFileUpload}
                    ref={hiddenFileInput}
                    style={{ display: 'none' }} // Make the file input element invisible
                />
                <label className='upload-file-name'>
                    {filename}
                </label>
            </div>

            {uploadedFile.length > 0 &&
                (<div className='file-process'>
                    <button className="button-process" onClick={handleFileProcessing}> Process File <MdOutlineSummarize /> </button>
                </div>)}
        </div>
    );
};

export default FileUploader;